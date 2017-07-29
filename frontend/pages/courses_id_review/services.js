// to problem model?
const calculateScore = (given, wanted) => {
  if (given === wanted) {
    return 5;
  } else { // given < wanted
    return (given / wanted) * 5; // 0..5
  }
};

const amountOfAnswerInputsInProblem = (problem) => {
  const amount = problem.content.content.search(/\|(.*?)\|/);
  return amount;
};

export { calculateScore, amountOfAnswerInputsInProblem };
