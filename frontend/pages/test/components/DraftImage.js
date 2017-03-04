 const {
  AtomicBlockUtils,
  Editor,
  EditorState,
  RichUtils,
  convertToRaw,
} = Draft;

class MediaEditorExample extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editorState: EditorState.createEmpty(),
      url: '',
    };

    this.focus = () => this.refs.editor.focus();
    this.onChange = (editorState) => this.setState({editorState});
  }

  // After removing handleKeyCommand, to remove the media I've inserted, I have to double press backspace to delete the figure. And the cursor disappear on the first backspace.
  _handleKeyCommand(command) {
    const newState = RichUtils.handleKeyCommand(this.state.editorState, command);
    if (newState) {
      this.onChange(newState);
      return true;
    }
    return false;
  }

  _confirmMedia() {
    const {editorState, urlValue} = this.state;
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(
      'image',
      'IMMUTABLE',
      {src: urlValue}
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = EditorState.set(
      editorState,
      {currentContent: contentStateWithEntity}
    );

    this.setState({
      editorState: AtomicBlockUtils.insertAtomicBlock(
        newEditorState,
        entityKey,
        ' '
      ),
      showURLInput: false,
      urlValue: '',
    }
  }

  myKeyBindingFn = (e) => {
    if (e.keyCode === 83 && hasCommandModifier(e)) {
      return 'hi';
    }
    return getDefaultKeyBinding(e);
  }
  handleKeyCommand(command: string): DraftHandleValue {
    if (command === 'hi') {
      // Perform a request to save your contents, set
      // a new `editorState`, etc.
      return 'handled';
    }
    return 'not-handled';
  }


  render = () =>
    <div style={styles.editor} onClick={this.focus}>
      <Editor
        blockRendererFn={(block) => (block.getType() === 'atomic') ?
          { component: Media, editable: false, } : null
        }
        editorState={this.state.editorState}
        handleKeyCommand={this.handleKeyCommand}
        onChange={this.onChange}
        placeholder="Enter some text..."
        ref="editor"
      />
    </div>
}

const Media = (props) => {
  const entity = props.contentState.getEntity(
    props.block.getEntityAt(0)
  );
  const {src} = entity.getData();
  const type = entity.getType(); // image

  return <img src={props.src}/>;
};
