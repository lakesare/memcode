import { Delta } from 'quill';

// [claude comment] a long line wraps onto several rows, and up/down arrows should first move through those rows
const ifOnSameRow = (quill, indexA, indexB) =>
  quill.getBounds(indexA).top === quill.getBounds(indexB).top;

function exitBlockFormatOnArrowDown(range) {
  if (range.length > 0) return true;

  const [line] = this.quill.getLine(range.index);
  const lineEndIndex = this.quill.getIndex(line) + line.length() - 1;
  const ifLastLine = lineEndIndex + 1 === this.quill.getLength();

  if (!ifLastLine || !ifOnSameRow(this.quill, range.index, lineEndIndex)) return true;

  this.quill.insertText(this.quill.getLength(), '\n', 'user');
  this.quill.setSelection(this.quill.getLength() - 1, 0, 'user');
  return false;
}

function exitBlockFormatOnArrowUp(range) {
  if (range.length > 0) return true;

  const [line] = this.quill.getLine(range.index);
  const ifFirstLine = this.quill.getIndex(line) === 0;

  if (!ifFirstLine || !ifOnSameRow(this.quill, range.index, 0)) return true;

  // [claude comment] unlike insertText(), a delta insert gives the new line exactly the formats it lists - none - instead of copying the quote/code block format of the line it is split from
  this.quill.updateContents(new Delta().insert('\n'), 'user');
  this.quill.setSelection(0, 0, 'user');
  return false;
}

export { exitBlockFormatOnArrowDown, exitBlockFormatOnArrowUp };
