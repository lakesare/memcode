
import {
  Editor, EditorState,
  RichUtils, getDefaultKeyBinding, KeyBindingUtil
} from 'draft-js';

class Draft extends React.Component {
  constructor(props) {
    super(props);
    this.state = { editorState: EditorState.createEmpty() };
  }

  // this function maps keys we press to strings that represent some action (eg 'undo', or 'underline')
  // then the this.handleKeyCommand('underline') function gets called with this string.
  keyBindingFn = (event) => {
    const ctrl = KeyBindingUtil.hasCommandModifier(event);
    // CTRL + B => return 'BOLD'
    if (event.keyCode === 17 && ctrl) { return 'BOLD'; }
    // CTRL + H => 'header-one'
    if (event.keyCode === 72 && ctrl) { return 'header-one'; }
    // CTRL + L => ordered-list-item
    if (event.keyCode === 76 && ctrl) { return 'ordered-list-item'; }

    // manages usual things, like:
    // Ctrl+Z => return 'undo'
    return getDefaultKeyBinding(event);
  }

  // command: string returned from this.keyBidingFn(event)
  // if this function returns 'handled' string, all ends here.
  // if it return 'not-handled', handling of :command will be delegated to Editor's default handling.
  handleKeyCommand = (command) => {
    let newState;
    switch (command) {
      case 'BOLD':
        newState = RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD');
        break;
      case 'header-one':
        newState = RichUtils.toggleBlockType(this.state.editorState, 'header-one');
        break;
      case 'ordered-list-item':
        newState = RichUtils.toggleBlockType(this.state.editorState, 'ordered-list-item');
        break;
      default:
        return 'not-handled';
    }

    this.setState({ editorState: newState });
    return 'handled';
  }

  render = () =>
    <Editor
      editorState={this.state.editorState}
      onChange={(newState) => this.setState({ editorState: newState })}
      handleKeyCommand={this.handleKeyCommand}
      keyBindingFn={this.keyBindingFn}
    />
}

export { Draft };
