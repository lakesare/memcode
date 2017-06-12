import { EditorState, Modifier } from 'draft-js';

import { getSelectedText } from '../getSelectedText';

const answerInput = () => ({
  keyBindingFn: (event, pluginFunctions) => {
    const isCollapsed = pluginFunctions.getEditorState().getSelection().isCollapsed();
    if (!isCollapsed) {
      if (event.keyCode === 13) { // A
        return 'markAsAnswer';
      }
    }
  },

  handleKeyCommand: (command, editorState, pluginFunctions) => {
    if (command === 'markAsAnswer') {
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
