import { textLinesOf } from './textLinesOf';

const MAX_RESULTS = 500;
const SNIPPET_CHARS = 110;

const indexesByDocument = new WeakMap();

// lowercase, ligatures split (ﬁ → fi), accents and punctuation dropped - so "Reasonable", "reason-able" and "réasonable" all match
const normalizeChar = (char) =>
  char.normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase();

const isWordChar = (char) => /[\p{L}\p{N}]/u.test(char);

// a page's text as one normalized string (what's searched) and as the original text (what's shown), plus for every normalized character the text item (line or word) it came from, its offset in that item, and its position in the original text
const indexPage = (lines) => {
  let text = '';
  let display = '';
  const charItem = [];
  const charOffset = [];
  const charDisplay = [];
  const rights = lines.map((line) => line.x1).sort((a, b) => a - b);
  const rightEdge = rights.length ? rights[Math.floor(rights.length * 0.95)] : 1;
  lines.forEach((line, itemIndex) => {
    const str = line.str;
    const next = lines[itemIndex + 1];
    // [claude comment] a word hyphenated at the end of a line is joined with its second half on the next line
    const ifHyphenated = /[A-Za-z]-\s*$/.test(str) && next && next.yCenter > line.yCenter + line.height * 0.5;
    const usable = ifHyphenated ? str.replace(/-\s*$/, '') : str;
    const displayStart = display.length;
    display += usable;
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
        charDisplay.push(displayStart + i);
      }
    }
    if (!ifHyphenated) {
      // [claude comment] a paragraph ends where its line stops well short of the right margin, or before a bigger gap - shown as a newline in the excerpt
      const ifNewLine = next && next.yCenter > line.yCenter + line.height * 0.5;
      const ifParagraphEnd = ifNewLine && (line.x1 < rightEdge - 0.08 || next.yCenter - line.yCenter > line.height * 2.2);
      display += ifParagraphEnd ? '\n' : ' ';
      if (text.length > 0 && text[text.length - 1] !== ' ') {
        text += ' ';
        charItem.push(itemIndex);
        charOffset.push(usable.length);
        charDisplay.push(display.length - 1);
      }
    }
  });
  return { text, display, charItem, charOffset, charDisplay, lines };
};

const tidy = (string) => string.replace(/[^\S\n]+/g, ' ').replace(/ *\n */g, '\n').replace(/\n{2,}/g, '\n');

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
      const displayStart = page.charDisplay[at];
      const displayEnd = page.charDisplay[end - 1] + 1;
      results.push({
        key:    `${index + 1}-${at}`,
        page:   index + 1,
        before: tidy(page.display.slice(Math.max(0, displayStart - SNIPPET_CHARS), displayStart)),
        match:  tidy(page.display.slice(displayStart, displayEnd)),
        after:  tidy(page.display.slice(displayEnd, displayEnd + SNIPPET_CHARS)),
        rects:  rectsOf(page, at, end)
      });
      from = end;
    }
  });
  return results;
};

export { buildIndex, search };
export default { buildIndex, search };
