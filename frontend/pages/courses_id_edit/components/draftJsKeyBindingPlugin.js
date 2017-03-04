import { RichUtils, getDefaultKeyBinding } from 'draft-js';

const draftJsKeyBindingPlugin = {
  keyBindingFn: (e) => {
    if (e.keyCode === 17) {
      return 'BOLD';
    }
    return getDefaultKeyBinding(e);
  },

  handleKeyCommand: (command, pluginFunctions) => {
    let newState;
    if (command === 'BOLD') {
      newState = RichUtils.toggleInlineStyle(pluginFunctions.getEditorState(), 'BOLD');
    }

    if (newState) {
      pluginFunctions.setEditorState(newState);
      return 'handled';
    }
    return 'not-handled';
  }
};

export { draftJsKeyBindingPlugin };
