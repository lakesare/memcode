import { RichUtils, KeyBindingUtil } from 'draft-js';

const richText = () => ({
  keyBindingFn: (event) => {
    if (!KeyBindingUtil.hasCommandModifier(event)) return;

    switch (event.keyCode) {
      case 66: return 'bold'; // B
      case 75: return 'code'; // K
      // case 13: return 'softNewline';
      default: return undefined; // must return undefined to allow for other plugins
    }
  },

  handleKeyCommand: (command, pluginFunctions) => {
    let newState;

    switch (command) {
      case 'bold':
        newState = RichUtils.toggleInlineStyle(pluginFunctions.getEditorState(), 'BOLD');
        break;
      case 'code':
        newState = RichUtils.toggleCode(pluginFunctions.getEditorState());
        break;
      // case 'softNewline':
      //   newState = RichUtils.insertSoftNewline(pluginFunctions.getEditorState());
      //   break;
      default:
        return 'not-handled';
    }

    pluginFunctions.setEditorState(newState);
    return 'handled';
  }
});

export { richText };
