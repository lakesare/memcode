import { shuffle } from 'lodash';

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
  // a particular flashcard
  statusOfSolving: null
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
      const nextApiProblem = state.speGetPage.payload.problems[nextIndex];

      return {
        ...state,
        statusOfSolving: freshStatusOfSolving(nextApiProblem, nextIndex)
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
          speNextReviewIn: {}
        };
      } else {
        return { ...state, speGetPage: spe };
      }
    }

    case 'SET_SPE_NEXT_REVIEW_IN': {
      return { ...state, speNextReviewIn: action.payload };
    }

    case 'RANDOMIZE_PROBLEMS': {
      const problems = state.speGetPage.payload.problems;
      const remainingProblems = problems.slice(state.statusOfSolving.index, problems.length);
      const randomProblems = shuffle(remainingProblems);
      return {
        ...state,
        speGetPage: {
          ...state.speGetPage,
          payload: {
            ...state.speGetPage.payload,
            problems: randomProblems
          }
        },
        statusOfSolving: freshStatusOfSolving(randomProblems[0], 0)
      };
    }

    default:
      return state;
  }
};

export default reducer;
