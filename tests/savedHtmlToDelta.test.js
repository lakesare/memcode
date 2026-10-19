import test from 'node:test';
import assert from 'node:assert/strict';

import window from './setupDom.js';
import Quill from 'quill';
import savedHtmlToDelta from '../frontend/services/quill/savedHtmlToDelta.js';

const quill = new Quill(window.document.body.appendChild(window.document.createElement('div')));

const load = (html) => {
  quill.setContents(savedHtmlToDelta(quill, html));
  return quill.root.innerHTML;
};

const codeBlock = (lines) =>
  '<div class="ql-code-block-container" spellcheck="false">' +
  lines.map((line) => `<div class="ql-code-block" data-language="plain">${line}</div>`).join('') +
  '</div>';

[
  ['single leading and trailing space', '<p> lead </p>'],
  ['tab and runs of spaces',            '<p>\ttab  two  </p>'],
  ['line of only spaces',               '<p>    </p>'],
  ['spaces between inline formats',     '<p><strong>a</strong>  <em>b</em></p>'],
  ['code block indentation',            codeBlock(['def f():', '    return  1', '<br>', ' one', '\ttab', 'trail '])]
].forEach(([name, html]) => {
  test(`keeps whitespace of html that Quill saved: ${name}`, () => {
    assert.equal(load(html), html);
  });
});

test('drops whitespace between blocks of hand-written html', () => {
  assert.equal(load('<p>imported</p> <p>after space</p>'), '<p>imported</p><p>after space</p>');
});

test('loads Quill 1 lists and code blocks with their whitespace', () => {
  load('<ul><li>a  b</li></ul><pre class="ql-syntax">x\n  y\n</pre>');
  assert.deepEqual(quill.getContents().ops, [
    { insert: 'a  b' },
    { insert: '\n', attributes: { list: 'bullet' } },
    { insert: 'x' },
    { insert: '\n', attributes: { 'code-block': 'plain' } },
    { insert: '  y' },
    { insert: '\n', attributes: { 'code-block': 'plain' } }
  ]);
});

test('leaves pasted html to Quill\'s own whitespace rules', () => {
  load('<p> lead </p>');
  assert.deepEqual(quill.clipboard.convert({ html: '<p>\n  pasted   web\n  text\n</p>' }).ops, [{ insert: 'pasted web text' }]);
});
