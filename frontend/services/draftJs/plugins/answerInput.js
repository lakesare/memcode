import {
  EditorState, KeyBindingUtil, Modifier
} from 'draft-js';

const answerInput = () => ({
  keyBindingFn: (event) => {
    if (KeyBindingUtil.hasCommandModifier(event) && event.keyCode === 81) { // Q
      return 'markAsAnswer';
    }
  },

  handleKeyCommand: (command, pluginFunctions) => {
    if (command === 'markAsAnswer') {
      const editorState = pluginFunctions.getEditorState();
      const contentState = editorState.getCurrentContent();

      const contentStateWithEntity = contentState.createEntity(
        'answer',
        'MUTABLE'
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
