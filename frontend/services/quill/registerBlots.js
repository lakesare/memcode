import Quill from 'quill';

import Answer from './blots/Answer';
Quill.register(Answer);

import LoadingImageBlot from './blots/LoadingImageBlot';
Quill.register(LoadingImageBlot);

// [claude comment]
// BEFORE THIS CHANGE: quill permits plain text only inside a code block, so parchment strips the surrounding <strong>/<em>/<mark> - bold, italic and answer vanish the instant a user applies the format.
// AFTER THIS CHANGE: bold, italic, underline, link and answer survive inside a code block. Images and formulas still do not, because EmbedBlot is deliberately left out - CodeBlockContainer.code() reads innerText, and would silently drop images and formulas.
const CodeBlock = Quill.import('formats/code-block');
const Inline    = Quill.import('blots/inline');
CodeBlock.allowedChildren = [...CodeBlock.allowedChildren, Inline];
