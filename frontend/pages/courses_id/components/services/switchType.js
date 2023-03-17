const switchType = (oldContent, newType) => {
  if (newType === 'separateAnswer') {
    return {
      content: oldContent.content,
      answer: oldContent.explanation
    };
  } else if (newType === 'inlinedAnswers') {
    return {
      content: oldContent.content,
      explanation: oldContent.answer
    };
  }
}

export default switchType;
