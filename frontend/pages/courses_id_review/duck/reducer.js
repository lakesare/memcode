import _ from 'lodash';

const initialState = {
  speGetPage: {},
  speNextReviewIn: {},
  // {
  //   index: 2, // speGetPage.payload.problems[2] - signifies current flashcard
  //   status: 'seeingAnswer', // or 'solving'
  //   typeSpecific: {
  //     amountOfRightAnswersGiven: 0
  //   } // or { selfScore: 5 }
  // }
  // status of solving a particular flashcard
  statusOfSolving: null,
  // ___idea:
  // statusOfReview: 'simulated', 'rereview', 'review', "what's next"
  // ___but for now let's do:
  // ifReviewingFailedProblems: {
  //   status: true,
  //   failedProblemIndexes: [3, 5, 6] // taken from speGetPage.payload.problems
  // }
  ifReviewingFailedProblems: false,
  indexesOfFailedProblems: []
};

import amountOfAnswerInputsInProblem from './services/amountOfAnswerInputsInProblem';
import freshStatusOfSolving from './services/freshStatusOfSolving';
import selectors from './selectors';

const reducer = (state = initialState, action) => {
  const currentProblem = selectors.deriveCurrentProblem(state);
  switch (action.type) {
    case 'INLINED_ANSWER_GIVEN': {
      const given = state.statusOfSolving.typeSpecific.amountOfRightAnswersGiven + 1;
      const wanted = amountOfAnswerInputsInProblem(currentProblem);

      return {
        ...state,
        statusOfSolving: {
          ...state.statusOfSolving,
          status: (given === wanted) ? 'seeingAnswer' : 'solving',
          typeSpecific: {
            ...state.statusOfSolving.typeSpecific,
            amountOfRightAnswersGiven: given
          }
        }
      };
    }

    case 'SEPARATE_ANSWER_SELF_SCORE_GIVEN': // selfScore
      return {
        ...state,
        statusOfSolving: {
          ...state.statusOfSolving,
          typeSpecific: {
            ...state.statusOfSolving.typeSpecific,
            selfScore: action.payload
          }
        }
      };

    case 'SET_STATUS_TO_SEEING_ANSWER':
      return {
        ...state,
        statusOfSolving: { ...state.statusOfSolving, status: 'seeingAnswer' }
      };

    case 'SET_NEXT_PROBLEM': { // (payload: problem index)
      const nextIndex = action.payload;
      const nextProblem = state.speGetPage.payload.problems[nextIndex];

      // JUST entering ifReviewingFailedProblems!
      if (!nextProblem && state.indexesOfFailedProblems.length > 0) {
        const firstFailedIndex = state.indexesOfFailedProblems[0];
        const reReviewProblem = state.speGetPage.payload.problems[firstFailedIndex];
        return {
          ...state,
          ifReviewingFailedProblems: true,
          statusOfSolving: freshStatusOfSolving(reReviewProblem, firstFailedIndex)
        };
      } else {
        return {
          ...state,
          statusOfSolving: freshStatusOfSolving(nextProblem, nextIndex)
        };
      }
    }

    case 'SET_NEXT_REREVIEW_PROBLEM': { // (action.payload: problem index relating to .indexesOfFailedProblems)
      const nextProblemIndex = state.indexesOfFailedProblems[0];
      const reReviewProblem = state.speGetPage.payload.problems[nextProblemIndex];
      return {
        ...state,
        statusOfSolving: freshStatusOfSolving(reReviewProblem, nextProblemIndex)
      };
    }

    case 'ADD_TO_FAILED_PROBLEMS': {
      return {
        ...state,
        indexesOfFailedProblems: [...state.indexesOfFailedProblems, action.payload]
      };
    }

    case 'DELETE_FROM_FAILED_PROBLEMS': {
      return {
        ...state,
        indexesOfFailedProblems: state.indexesOfFailedProblems.filter((index) => index !== action.payload)
      };
    }

    case 'SET_SPE_GET_PAGE': {
      const spe = action.payload;
      if (action.payload.status === 'success') {
        const firstProblem = spe.payload.problems[0];
        return {
          ...state,
          speGetPage: spe,
          statusOfSolving: freshStatusOfSolving(firstProblem, 0),
          // um because it won't get reloaded if we come from /:id/review to another /:id/review
          speNextReviewIn: {},
          ifReviewingFailedProblems: false,
          indexesOfFailedProblems: []
        };
      } else {
        return { ...state, speGetPage: spe };
      }
    }

    case 'SET_SPE_NEXT_REVIEW_IN': {
      return { ...state, speNextReviewIn: action.payload };
    }

    case 'RANDOMIZE_PROBLEMS': {
      // there are always > 2 problems if this function is called
      const problems = state.speGetPage.payload.problems;
      const currentProblemIndex = state.statusOfSolving.index;

      const remainingProblems = problems.slice(currentProblemIndex, problems.length);

      let randomProblems;
      let ifCurrentProblemDidntChange = true;
      while (ifCurrentProblemDidntChange) {
        randomProblems = [
          ...problems.slice(0, currentProblemIndex),
          ..._.shuffle(remainingProblems)
        ];
        ifCurrentProblemDidntChange = randomProblems[currentProblemIndex].id === problems[currentProblemIndex].id;
      }

      return {
        ...state,
        speGetPage: {
          ...state.speGetPage,
          payload: {
            ...state.speGetPage.payload,
            problems: randomProblems
          }
        },
        statusOfSolving: freshStatusOfSolving(randomProblems[currentProblemIndex], currentProblemIndex)
      };
    }

    case 'SWITCH_QUESTION_AND_ANSWER': {
      const problems = state.speGetPage.payload.problems;
      const newProblems = problems.map((problem) => {
        if (problem.type === 'separateAnswer') {
          return {
            ...problem,
            content: {
              content: problem.content.answer,
              answer: problem.content.content
            }
          };
        } else {
          return problem;
        }
      });

      return {
        ...state,
        speGetPage: {
          ...state.speGetPage,
          payload: {
            ...state.speGetPage.payload,
            problems: newProblems
          }
        }
      };
    }

    default:
      return state;
  }
};

export default reducer;
