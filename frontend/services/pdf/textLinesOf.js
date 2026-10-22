import { getTextLines } from './geometry';

const caches = new WeakMap();

// memoized per document and page, the viewer (for snapping) and the places dropdown (for context) share it
const textLinesOf = (pdfjs, pdfDocument, pageNumber) => {
  if (!caches.has(pdfDocument)) caches.set(pdfDocument, {});
  const cache = caches.get(pdfDocument);
  if (!cache[pageNumber]) {
    cache[pageNumber] = pdfDocument.getPage(pageNumber)
      .then((page) => getTextLines(pdfjs, page))
      .catch(() => []);
  }
  return cache[pageNumber];
};

// distance between neighbouring text lines, as a fraction of the page's height
const lineSpacingOf = (textLines) => {
  const centers = [...new Set(textLines.map((line) => Math.round(line.yCenter * 2000) / 2000))].sort((a, b) => a - b);
  const heights = textLines.map((line) => line.height).sort((a, b) => a - b);
  const medianHeight = heights.length ? heights[Math.floor(heights.length / 2)] : 0.012;
  const gaps = [];
  for (let i = 1; i < centers.length; i++) {
    const gap = centers[i] - centers[i - 1];
    if (gap > medianHeight * 0.6 && gap < medianHeight * 4) gaps.push(gap);
  }
  gaps.sort((a, b) => a - b);
  return gaps.length ? gaps[Math.floor(gaps.length / 2)] : 0.022;
};

export { textLinesOf, lineSpacingOf };
export default textLinesOf;
