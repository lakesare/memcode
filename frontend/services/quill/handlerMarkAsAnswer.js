function handlerMarkAsAnswer() {
  const range = this.quill.getSelection();
  if (range) {
    this.quill.formatText(
      range.index, range.length, // from start to end of selection
      'answer',
      !this.quill.getFormat(range).answer
    );
  }
}

export default handlerMarkAsAnswer;
