import { calculateScore, amountOfAnswerInputsInProblem } from './services';

const deriveCurrentProblem = (state) => {
  const spe = state.speGetPage;
  if (spe.status === 'success') {
    return spe.payload.problems[state.statusOfSolving.index];
  } else {
    return null;
  }
};

const deriveScore = (state) => {
  const currentProblem = deriveCurrentProblem(state);
  switch (currentProblem.type) {
    case 'inlinedAnswers': {
      // given: amount of answers that were properly given
      // wanted: amount of all problems
      const given = state.statusOfSolving.typeSpecific.amountOfRightAnswersGiven;
      const wanted = amountOfAnswerInputsInProblem(currentProblem);
      return calculateScore(given, wanted);
    }
    case 'separateAnswer':
      return state.statusOfSolving.typeSpecific.selfScore;
  }
};

export { deriveCurrentProblem, deriveScore };
