import { EditorState, convertFromRaw } from 'draft-js';

const createEditorState = (raw) => {
  if (raw) {
    return EditorState.createWithContent(convertFromRaw(raw));
  } else {
    return EditorState.createEmpty();
  }
};

export { createEditorState };
