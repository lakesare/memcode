import React from 'react';

import {
  Editor, EditorState,
  AtomicBlockUtils
} from 'draft-js';

const Image = props => <img src={props.blockProps.src}/>;

class Draft extends React.Component {
  constructor(props) {
    super(props);
    this.state = { editorState: EditorState.createEmpty() };
  }

  blockRendererFn = (contentBlock) => {
    const type = contentBlock.getType();
    if (type === 'atomic') {
      const entity = this.state.editorState.getCurrentContent().getEntity(
        contentBlock.getEntityAt(0)
      );

      const metaData = entity.getData();
      switch (entity.getType()) {
        case 'immmage':
          return {
            component: Image,
            editable: false,
            props: { src: metaData.src } // accessible via props.blockProps
          };
        default: return null;
      }
    }
    return null;
  }

  insertImage = (src) => {
    const editorState = this.state.editorState;
    const contentState = editorState.getCurrentContent();

    const contentStateWithEntity = contentState.createEntity('immmage', 'IMMUTABLE', { src });
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

    const newEditorState = EditorState.set(
      editorState,
      { currentContent: contentStateWithEntity }
    );

    this.setState({
      editorState: AtomicBlockUtils.insertAtomicBlock(
        newEditorState,
        entityKey,
        ' '
      )
    });
  }

  handlePastedFiles = (files) => {
    const reader = new FileReader();
    reader.onloadend = () => this.insertImage(reader.result);

    reader.readAsDataURL(files[0]); // result attribute contains  the data as a URL representing the file's data as a base64 encoded string.
  }

  render = () =>
    <Editor
      editorState={this.state.editorState}
      onChange={newState => this.setState({ editorState: newState })}
      blockRendererFn={this.blockRendererFn}
      handlePastedFiles={this.handlePastedFiles}
    />

}

export { Draft };
