import { RichUtils, KeyBindingUtil } from 'draft-js';

const richText = () => ({
  keyBindingFn: (event) => {
    // B
    if (KeyBindingUtil.hasCommandModifier(event) && event.keyCode === 66) {
      return 'bbbold';
    }
  },

  handleKeyCommand: (command, pluginFunctions) => {

    let newState;
    if (command === 'bbbold') {
      newState = RichUtils.toggleInlineStyle(pluginFunctions.getEditorState(), 'BOLD');
    }

    if (newState) {
      pluginFunctions.setEditorState(newState);
      return 'handled';
    }
    return 'not-handled';
  }
});

export { richText };
