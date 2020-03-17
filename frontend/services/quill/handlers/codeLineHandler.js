// eslint-disable-next-line
function codeLineHandler (range, context) {
  if (context.format['code']) {
    this.quill.formatText(range, 'code', false);
  } else {
    this.quill.formatText(range, 'code', true);
  }
}

export default codeLineHandler;
