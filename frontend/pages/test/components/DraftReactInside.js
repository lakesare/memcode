import React from 'react';

import {
  Editor, EditorState,
  AtomicBlockUtils, Modifier
} from 'draft-js';

const Image = (props) => {
  const entity = props.contentState.getEntity(
    props.block.getEntityAt(0) // returns entity key
  );
  const data = entity.getData();
  console.log(props)
  return <img src={data.src}/>


  // console.log(entity.getType()) // immmage
}

class Draft extends React.Component {
  constructor(props) {
    super(props);
    this.state = { editorState: EditorState.createEmpty() };
  }

  blockRendererFn = (contentBlock) => {
    const type = contentBlock.getType();
    if (type === 'atomic') {
      return {
        component: Image,
        editable: false,
        // props: { hello: 'wow' } // accessible via props.blockProps
      };
    }
    return null;
  }

  pasteInImage = (src) => {
    const editorState = this.state.editorState;
    const contentState = editorState.getCurrentContent();

    const contentStateWithEntity = contentState.createEntity('immmmage', 'IMMUTABLE', { src })

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
    reader.onloadend = () => this.pasteInImage(reader.result);
    reader.readAsDataURL(files[0]); // result attribute contains  the data as a URL representing the file's data as a base64 encoded string.
  }

  render = () =>
    <div>
      <Editor
        editorState={this.state.editorState}
        onChange={newState => this.setState({ editorState: newState })}
        blockRendererFn={this.blockRendererFn}
        handlePastedFiles={this.handlePastedFiles}
      />
    </div>
}

export { Draft };


