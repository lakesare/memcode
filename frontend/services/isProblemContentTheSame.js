const isProblemContentTheSame = (problem_1, problem_2) => {
  if (problem_1.type === 'separateAnswer') {
    return (
      problem_1.content.content === problem_2.content.content &&
      problem_1.content.answer === problem_2.content.answer
    );
  } else if (problem_2.type === 'inlinedAnswers') {
    return (
      problem_1.content.content === problem_2.content.content &&
      problem_1.content.explanation === problem_2.content.explanation
    );
  }
};

export default isProblemContentTheSame;
