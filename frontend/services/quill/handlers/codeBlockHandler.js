// eslint-disable-next-line
function codeBlockHandler (range, context) {
  if (context.format['code-block']) {
    this.quill.formatLine(range, 'code-block', false);
  } else {
    this.quill.formatLine(range, 'code-block', 1);
  }
  this.quill.setSelection(range);
}

export default codeBlockHandler;
