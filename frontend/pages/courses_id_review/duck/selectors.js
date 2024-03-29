import calculateScore from './services/calculateScore';
import amountOfAnswerInputsInProblem from './services/amountOfAnswerInputsInProblem';

const deriveCurrentProblem = (state) => {
  const spe = state.speGetPage;
  if (spe.status === 'success') {
    const currentIndex = state.statusOfSolving.index;
    return spe.payload.problems[currentIndex];
  } else {
    return null;
  }
};

const deriveScore = (state, clozeDeletionMode) => {
  const currentProblem = deriveCurrentProblem(state);
  switch (currentProblem.type) {
    case 'inlinedAnswers': {
      if (clozeDeletionMode === "typing") {
        // given: amount of answers that were properly given
        // wanted: amount of all problems
        const given = state.statusOfSolving.typeSpecific.amountOfRightAnswersGiven;
        const wanted = amountOfAnswerInputsInProblem(currentProblem);
        return calculateScore(given, wanted);
      } else {
        return state.statusOfSolving.typeSpecific.selfScore;
      }
    }
    case 'separateAnswer':
      return state.statusOfSolving.typeSpecific.selfScore;
  }
};

export default { deriveCurrentProblem, deriveScore };
