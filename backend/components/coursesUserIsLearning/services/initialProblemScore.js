const initialProblemScore = (problemId) => ({
  problemId,
  value: {
    easiness: 2.5,
    consecutiveCorrectAnswers: 0,
    nextDueDate: null
  }
});

export { initialProblemScore };
