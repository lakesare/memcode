function markAsAnswerHandler() {
  // Range {index: 25, length: 3}
  const range = this.quill.getSelection();

  if (range) {
    let firstIndexOfSelection = range.index;
    let lastIndexOfSelection = range.index + range.length - 1;

    // around selection
    const firstLetterOfSelection = this.quill.getText(firstIndexOfSelection, 1);
    const lastLetterOfSelection = this.quill.getText(lastIndexOfSelection, 1);

    if (firstLetterOfSelection === ' ') {
      firstIndexOfSelection++;
    }
    if (lastLetterOfSelection === ' ') {
      lastIndexOfSelection--;
    }

    this.quill.formatText(
      firstIndexOfSelection,
      lastIndexOfSelection - firstIndexOfSelection + 1, // from start to end of selection
      'answer',
      !this.quill.getFormat(range).answer
    );
  }
}

export default markAsAnswerHandler;
