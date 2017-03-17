import { EditorState, Modifier } from 'draft-js';

const getSelectedText = (editorState) => {
  // Get block for current selection
  const selection = editorState.getSelection();
  const anchorKey = selection.getAnchorKey();
  const currentBlock = editorState.getCurrentContent().getBlockForKey(anchorKey);

  // Then based on the docs for SelectionState -
  const selectedText = currentBlock.getText().slice(
    selection.getStartOffset(),
    selection.getEndOffset()
  );

  return selectedText;
};

const answerInput = () => ({
  keyBindingFn: (event, pluginFunctions) => {
    const isCollapsed = pluginFunctions.getEditorState().getSelection().isCollapsed();
    if (!isCollapsed) {
      if (event.keyCode === 13) { // A
        return 'markAsAnswer';
      }
    }
  },

  handleKeyCommand: (command, pluginFunctions) => {
    if (command === 'markAsAnswer') {
      const editorState = pluginFunctions.getEditorState();
      const contentState = editorState.getCurrentContent();

      const contentStateWithEntity = contentState.createEntity(
        'answer',
        'IMMUTABLE',
        { answer: getSelectedText(editorState) }
      );
      const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

      const newContentState = Modifier.applyEntity(
        contentStateWithEntity,
        editorState.getSelection(),
        entityKey
      );

      // all content changes must be applied to the EditorState with this method.
      const newEditorState = EditorState.push(editorState, newContentState);
      pluginFunctions.setEditorState(newEditorState);
      return 'handled';
    }

    return 'not-handled';
  }
});

export { answerInput };
