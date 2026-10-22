import { textLinesOf } from './textLinesOf';

const PADDING = 0.03;
const MIN_LINES = 4;
const MIN_VISIBLE_WIDTH = 0.4;
const SAMPLE_PAGES = 16;

const trimsByDocument = new WeakMap();

// [left, right] of a page's text block as fractions of the page width, or null when the page has too little text to tell
const textBounds = (lines) => {
  const usable = lines.filter((line) => line.x1 - line.x0 > 0.01 && line.x0 >= 0 && line.x1 <= 1);
  if (usable.length < MIN_LINES) return null;
  const lefts = usable.map((line) => line.x0).sort((a, b) => a - b);
  const rights = usable.map((line) => line.x1).sort((a, b) => a - b);
  // [claude comment] the 1st/99th percentile rather than min/max, so a stray OCR speck in the margin doesn't undo the trim
  return [lefts[Math.floor(lefts.length * 0.01)], rights[Math.ceil(rights.length * 0.99) - 1]];
};

// [claude comment] one trim for the whole book, wide enough for the text of every sampled page (the second-widest, so one odd page doesn't decide) - the text size stays the same from page to page
const computeBookTrim = async (pdfjs, pdfDocument) => {
  const nOfPages = pdfDocument.numPages;
  const nOfSamples = Math.min(SAMPLE_PAGES, nOfPages);
  const samples = [...new Set(Array.from({ length: nOfSamples }, (_, i) =>
    1 + Math.round(i * (nOfPages - 1) / Math.max(1, nOfSamples - 1))
  ))];
  const bounds = (await Promise.all(samples.map((n) => textLinesOf(pdfjs, pdfDocument, n).then(textBounds)))).filter(Boolean);
  if (bounds.length === 0) return [0, 1];
  const lefts = bounds.map((b) => b[0]).sort((a, b) => a - b);
  const rights = bounds.map((b) => b[1]).sort((a, b) => b - a);
  const secondWidest = (sorted) => sorted[Math.min(1, sorted.length - 1)];
  const left = Math.max(0, secondWidest(lefts) - PADDING);
  const right = Math.min(1, secondWidest(rights) + PADDING);
  return right - left >= MIN_VISIBLE_WIDTH ? [left, right] : [0, 1];
};

// memoized per document
const autoTrimOf = (pdfjs, pdfDocument) => {
  if (!trimsByDocument.has(pdfDocument)) {
    trimsByDocument.set(pdfDocument, computeBookTrim(pdfjs, pdfDocument).catch(() => [0, 1]));
  }
  return trimsByDocument.get(pdfDocument);
};

export { autoTrimOf };
export default autoTrimOf;
