import EditCode from 'slate-edit-code';

const editCode = EditCode({ containerType: 'codeBlock' });

const CodePlugin = () => ({
  ...editCode,

  onKeyDown: (event, data, state) => {
    // CTRL+k
    if (event.which === 75 && data.isCtrl) {
      event.preventDefault();
      return editCode.transforms
        .toggleCodeBlock(state.transform(), 'paragraph')
        .focus()
        .apply();
    }
  },

  schema: {
    nodes: {
      codeBlock: props => <code {...props.attributes}>{props.children}</code>,
      code_line:  props => <pre {...props.attributes}>{props.children}</pre>,
    }
  }
});

export { CodePlugin };
