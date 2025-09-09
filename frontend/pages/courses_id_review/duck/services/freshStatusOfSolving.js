import TtsService from '~/services/ttsService';

const freshStatusOfSolving = (problem, index) => {
  // index, // reference to the currentProblem
  // status: 'solving', // or 'seeingAnswer' == 'givingRating (default 5)' == 'nextProblem' (in the same time)
  if (!problem) return { index: -1 }; // no more problems

  switch (problem.type) {
    case 'inlinedAnswers':
      return {
        index,
        status: TtsService.countAnswerBlanks(problem.content.content) === 0 ? 'seeingAnswer' : 'solving',
        typeSpecific: { amountOfRightAnswersGiven: 0, selfScore: 5 }
      };
    case 'separateAnswer':
      return {
        index,
        status: 'solving',
        typeSpecific: { selfScore: 5 }
      };
    default:
      throw Error(`Problem.type is ${problem.type}, we don't know it`);
  }
};

export default freshStatusOfSolving;
