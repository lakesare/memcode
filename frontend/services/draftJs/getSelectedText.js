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

export { getSelectedText };
