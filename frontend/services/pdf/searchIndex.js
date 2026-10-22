import { textLinesOf } from './textLinesOf';

const MAX_RESULTS = 500;
const SNIPPET_CHARS = 60;

const indexesByDocument = new WeakMap();

// lowercase, ligatures split (ﬁ → fi), accents and punctuation dropped - so "Reasonable", "reason-able" and "réasonable" all match
const normalizeChar = (char) =>
  char.normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase();

const isWordChar = (char) => /[\p{L}\p{N}]/u.test(char);

// a page's text as one normalized string, plus for every character the text item (line or word) it came from and its offset in that item
const indexPage = (lines) => {
  let text = '';
  const charItem = [];
  const charOffset = [];
  lines.forEach((line, itemIndex) => {
    const str = line.str;
    const next = lines[itemIndex + 1];
    // [claude comment] a word hyphenated at the end of a line is joined with its second half on the next line
    const ifHyphenated = /[A-Za-z]-\s*$/.test(str) && next && next.yCenter > line.yCenter + line.height * 0.5;
    const usable = ifHyphenated ? str.replace(/-\s*$/, '') : str;
    for (let i = 0; i < usable.length; i++) {
      const normalized = normalizeChar(usable[i]);
      for (const char of normalized) {
        if (isWordChar(char)) {
          text += char;
        } else if (text.length > 0 && text[text.length - 1] !== ' ') {
          text += ' ';
        } else {
          continue;
        }
        charItem.push(itemIndex);
        charOffset.push(i);
      }
    }
    if (!ifHyphenated && text.length > 0 && text[text.length - 1] !== ' ') {
      text += ' ';
      charItem.push(itemIndex);
      charOffset.push(usable.length);
    }
  });
  return { text, charItem, charOffset, lines };
};

const normalizeQuery = (query) =>
  Array.from(query).map(normalizeChar).join('').replace(/[^\p{L}\p{N}]+/gu, ' ').trim();

// reads the whole book's text once per document; onProgress(pagesRead, nOfPages)
const buildIndex = (pdfjs, pdfDocument, onProgress) => {
  if (!indexesByDocument.has(pdfDocument)) {
    const promise = (async () => {
      const pages = [];
      for (let n = 1; n <= pdfDocument.numPages; n++) {
        const lines = await textLinesOf(pdfjs, pdfDocument, n);
        pages.push(indexPage(lines));
        if (onProgress && n % 5 === 0) onProgress(n, pdfDocument.numPages);
      }
      return pages;
    })();
    indexesByDocument.set(pdfDocument, promise);
    promise.catch(() => indexesByDocument.delete(pdfDocument));
  }
  return indexesByDocument.get(pdfDocument);
};

// the matched part of each text item, as rectangles in fractions of the page's width/height
const rectsOf = (page, start, end) => {
  const byItem = {};
  for (let i = start; i < end; i++) {
    const item = page.charItem[i];
    const offset = page.charOffset[i];
    if (!byItem[item]) byItem[item] = { from: offset, to: offset + 1 };
    byItem[item].from = Math.min(byItem[item].from, offset);
    byItem[item].to = Math.max(byItem[item].to, offset + 1);
  }
  return Object.entries(byItem).map(([itemIndex, { from, to }]) => {
    const line = page.lines[itemIndex];
    const length = Math.max(1, line.str.length);
    const width = line.x1 - line.x0;
    return {
      left:   line.x0 + width * from / length,
      right:  line.x0 + width * Math.min(length, to) / length,
      top:    line.yCenter - line.height * 0.62,
      bottom: line.yCenter + line.height * 0.42
    };
  });
};

const search = (pages, query) => {
  const needle = normalizeQuery(query);
  if (needle.length < 2) return [];
  const results = [];
  pages.forEach((page, index) => {
    let from = 0;
    for (;;) {
      const at = page.text.indexOf(needle, from);
      if (at === -1 || results.length >= MAX_RESULTS) break;
      const end = at + needle.length;
      results.push({
        key:    `${index + 1}-${at}`,
        page:   index + 1,
        before: page.text.slice(Math.max(0, at - SNIPPET_CHARS), at),
        match:  page.text.slice(at, end),
        after:  page.text.slice(end, end + SNIPPET_CHARS),
        rects:  rectsOf(page, at, end)
      });
      from = end;
    }
  });
  return results;
};

export { buildIndex, search };
export default { buildIndex, search };
