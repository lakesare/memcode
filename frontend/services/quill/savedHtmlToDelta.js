import Quill from 'quill';
import { matchText } from 'quill/modules/clipboard';

const { Scope } = Quill.import('parchment');

const isBlock = (node, scroll) =>
  node instanceof Element && scroll.query(node, Scope.BLOCK) !== null;

const matchTextLiterally = (node, delta, scroll) => {
  const isWhitespaceBetweenBlocks =
    node.data.trim() === '' &&
    (isBlock(node.previousSibling, scroll) || isBlock(node.nextSibling, scroll));

  if (isWhitespaceBetweenBlocks) {
    return delta;
  } else {
    return delta.insert(node.data);
  }
};

// [claude comment] saved html is Quill's own innerHTML, shown with white-space: pre-wrap, so every space/tab in it is content - but Quill's matchText collapses and strips whitespace as if it were pasted web html, so swap matchText out for the duration of this convert()
const savedHtmlToDelta = (quill, html) => {
  const matchers = quill.clipboard.matchers;
  quill.clipboard.matchers = matchers.map(([selector, matcher]) =>
    [selector, matcher === matchText ? matchTextLiterally : matcher]
  );
  try {
    return quill.clipboard.convert({ html });
  } finally {
    quill.clipboard.matchers = matchers;
  }
};

export default savedHtmlToDelta;
