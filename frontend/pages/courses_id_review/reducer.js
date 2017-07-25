const initialState = {
  speGetPage: {},
  statusOfSolving: null,
};

const freshStatusOfSolving = (problem, index) => {
  // index, // reference to the currentProblem
  // status: 'solving', // or 'seeingAnswer' == 'givingRating (default 5)' == 'nextProblem' (in the same time)
  if (!problem) return { index: -1 }; // no more problems

  switch (problem.type) {
    case 'inlinedAnswers':
      return {
        index,
        status: amountOfAnswerInputsInProblem(problem) === 0 ? 'seeingAnswer' : 'solving',
        typeSpecific: { amountOfRightAnswersGiven: 0 }
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

import { deriveCurrentProblem, deriveScore } from './selectors';
import { amountOfAnswerInputsInProblem } from './services';

const Page_courses_id_review_Reducer = (state = initialState, action) => {
  const currentProblem = deriveCurrentProblem(state);
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
          statusOfSolving: freshStatusOfSolving(firstProblem, 0)
        };
      } else {
        return { ...state, speGetPage: spe };
      }
    }
    default:
      return state;
  }
};

import * as CourseUserIsLearningApi from '~/api/CourseUserIsLearning';
import { commonFetch } from '~/api/commonFetch';

const Page_courses_id_review_Actions = {
  enterPressed: () =>
    (dispatch, getState) => {
      const state = getState().pages.Page_courses_id_review;
      switch (state.statusOfSolving.status) {
        case 'solving':
          dispatch({ type: 'SET_STATUS_TO_SEEING_ANSWER' });
          break;
        case 'seeingAnswer':
          CourseUserIsLearningApi.reviewProblem(
            () => {},
            state.speGetPage.payload.courseUserIsLearning.id,
            deriveCurrentProblem(state).id,
            deriveScore(state)
          );
          dispatch({
            type: 'CHANGE_AMOUNT_OF_PROBLEMS_TO_REVIEW_BY',
            payload: -1
          });
          dispatch({
            type: 'SET_NEXT_PROBLEM',
            payload: state.statusOfSolving.index + 1
          });
          break;
      }
    },

  enterPressedInSimulatedReview: () =>
    (dispatch, getState) => {
      const state = getState().pages.Page_courses_id_review;
      switch (state.statusOfSolving.status) {
        case 'solving':
          dispatch({ type: 'SET_STATUS_TO_SEEING_ANSWER' });
          break;
        case 'seeingAnswer':
          dispatch({
            type: 'SET_NEXT_PROBLEM',
            payload: state.statusOfSolving.index + 1
          });
          break;
      }
    },

  getPage: (courseId, ifSimulated) =>
    (dispatch) =>
      commonFetch(
        (spe) => dispatch({ type: 'SET_SPE_GET_PAGE', payload: spe }),
        'GET', `/api/pages/courses/${courseId}/review?ifSimulated=${ifSimulated}`
      )
};

export { Page_courses_id_review_Reducer, Page_courses_id_review_Actions };
