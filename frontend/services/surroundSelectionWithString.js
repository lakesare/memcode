

// surroundSelectionWithString(element, stringBefore, stringAfter)
const surroundSelectionWithString = (textarea, stringBefore, stringAfter) => {
  const nextTextareaValue  = findNextTextareaValue(textarea.value, textarea.selectionStart, textarea.selectionEnd, stringBefore, stringAfter);
  const nextCursorPosition = findNextCursorPosition(textarea.selectionStart, stringBefore)

  textarea.value          = nextTextareaValue;
  textarea.selectionStart = nextCursorPosition;
  textarea.selectionEnd   = nextCursorPosition;
}

const findNextTextareaValue = (value, selectionStart, selectionEnd, stringBefore, stringAfter) => {
  const front  = value.slice(0, selectionStart);
  const middle = value.slice(selectionStart, selectionEnd);
  const back   = value.slice(selectionEnd, value.length);
  return(front + stringBefore + middle + stringAfter + back)
}

const findNextCursorPosition = (selectionStart, stringBefore) => {
  const nextCursorPosition = selectionStart + stringBefore.length;
  return(nextCursorPosition)
}

export { surroundSelectionWithString };

