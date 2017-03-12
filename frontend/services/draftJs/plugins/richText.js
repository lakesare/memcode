import { RichUtils, KeyBindingUtil } from 'draft-js';

const richText = () => ({
  keyBindingFn: (event) => {
    if (!KeyBindingUtil.hasCommandModifier(event)) return;

    switch (event.keyCode) {
      case 66: return 'bbbold'; // B
      case 75: return 'cccode'; // K
      default: return undefined; // must return undefined to allow for other plugins
    }
  },

  handleKeyCommand: (command, pluginFunctions) => {
    let newState;

    switch (command) {
      case 'bbbold':
        newState = RichUtils.toggleInlineStyle(pluginFunctions.getEditorState(), 'BOLD');
        break;
      case 'cccode':
        newState = RichUtils.toggleCode(pluginFunctions.getEditorState());
        break;
      default:
        return 'not-handled';
    }

    pluginFunctions.setEditorState(newState);
    return 'handled';
  }
});

export { richText };
