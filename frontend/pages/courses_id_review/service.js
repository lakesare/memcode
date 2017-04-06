// to problem model?
const calculateScore = (given, wanted) => {
  if (given === wanted) {
    return 5;
  } else { // given < wanted
    return (given / wanted) * 5; // 0..5
  }
};

// to problem model?
const amountOfAnswerInputsInProblem = (problem) => {
  const entities = problem.content.entityMap;
  const answerEntities = Object.keys(entities)
    .filter((key) => entities[key].type === 'answer');
  return answerEntities.length;
};

export { calculateScore, amountOfAnswerInputsInProblem };
