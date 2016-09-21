const problemContentToTextarea = (content) => {
  let aa = [];
  let answerIndex = 0;
  content.text.forEach((textPart) => {
    if (textPart === null) {
      aa.push(`<answer>${content.answers[answerIndex].answer}</answer>`);
      answerIndex ++;
    } else {
      aa.push(textPart)
    }
  });

  return (aa.join(' '))
}

export { problemContentToTextarea };