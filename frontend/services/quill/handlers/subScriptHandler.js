// eslint-disable-next-line
function subScriptHandler (range, context) {
  if (context.format.script === 'sub') {
    this.quill.formatText(range, 'script', false);
  } else {
    this.quill.formatText(range, { script: 'sub' }, true);
  }
}

export default subScriptHandler;
