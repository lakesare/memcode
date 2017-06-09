import {
  EditorState,
  AtomicBlockUtils
} from 'draft-js';

const pasteImageFromClipboard = () => ({
  blockRendererFn: (contentBlock, pluginFunctions) => {
    const type = contentBlock.getType();
    if (type === 'atomic') {
      try {
        const entity = pluginFunctions.getEditorState().getCurrentContent().getEntity(
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
      } catch (e) { // this error will be catched in ~/api/handleErrors
        // no idea what causes this
        // Error: Unknown DraftEntity key.
        // but it tends to appear on image parsing.
        //
        // catching this error will at least help course
        // (and problem apart from one image) to be displayed
      }
    }
    return null;
  },

  handlePastedFiles: (files, pluginFunctions) => {
    const reader = new FileReader();
    // reader.result contains  the data as a URL representing the file's data as a base64 encoded string.
    reader.onloadend = () => insertImage(reader.result, pluginFunctions);
    reader.readAsDataURL(files[0]);
  }
});

const Image = props => <img src={props.blockProps.src}/>;

const insertImage = (src, pluginFunctions) => {
  const editorState = pluginFunctions.getEditorState();
  const contentState = editorState.getCurrentContent();

  const contentStateWithEntity = contentState.createEntity('immmage', 'IMMUTABLE', { src });
  const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

  const newEditorState = EditorState.set(
    editorState,
    { currentContent: contentStateWithEntity }
  );

  pluginFunctions.setEditorState(
    AtomicBlockUtils.insertAtomicBlock(
      newEditorState,
      entityKey,
      ' '
    )
  );
};

export { pasteImageFromClipboard };
