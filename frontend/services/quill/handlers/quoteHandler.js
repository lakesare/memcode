// eslint-disable-next-line
function codeBlockHandler (range, context) {
  if (context.format['blockquote']) {
    this.quill.formatLine(range, 'blockquote', false);
  } else {
    this.quill.formatLine(range, 'blockquote', 1);
  }
  this.quill.setSelection(range);
}

export default codeBlockHandler;
