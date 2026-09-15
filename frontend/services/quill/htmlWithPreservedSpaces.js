// [claude comment] Quill's clipboard.convert() collapses runs of plain spaces on load, so turn 2+ spaces into nbsp (except inside <pre>, which Quill already preserves) to keep multi-space content through the round-trip
const htmlWithPreservedSpaces = (html) => {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const walker = document.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT);

  const textNodes = [];
  while (walker.nextNode()) textNodes.push(walker.currentNode);

  textNodes.forEach((node) => {
    if (node.parentElement && node.parentElement.closest('pre')) return;
    node.data = node.data.replace(/ {2,}/g, (run) => '\u00a0'.repeat(run.length));
  });

  return doc.body.innerHTML;
};

export default htmlWithPreservedSpaces;
