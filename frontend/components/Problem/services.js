import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';

const isReadonly = (mode) =>
  mode === 'solving' ||
  mode === 'viewing';

const toApi = (state) =>
  convertToRaw(state.getCurrentContent());

const fromApi = (raw) => {
  if (raw) {
    return EditorState.createWithContent(convertFromRaw(raw));
  } else {
    return EditorState.createEmpty();
  }
};

export { isReadonly, toApi, fromApi };
