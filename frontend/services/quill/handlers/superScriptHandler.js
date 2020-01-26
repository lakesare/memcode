// eslint-disable-next-line
function superScriptHandler (range, context) {
  if (context.format.script === 'super') {
    this.quill.formatText(range, 'script', false);
  } else {
    this.quill.formatText(range, { script: 'super' }, true);
  }
}

export default superScriptHandler;
