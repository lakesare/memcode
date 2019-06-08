import { IdsOfProblemsToLearnAndReviewPerCourseActions } from '~/reducers/IdsOfProblemsToLearnAndReviewPerCourse';
import * as CourseUserIsLearningApi from '~/api/CourseUserIsLearning';
import { commonFetch } from '~/api/commonFetch';

import selectors from './selectors';

const enterPressed = () =>
  (dispatch, getState) => {
    const state = getState().pages.Page_courses_id_review;
    if (state.ifReviewingFailedProblems) {
      enterPressedInFailedMode()(dispatch, getState);
    } else {
      switch (state.statusOfSolving.status) {
        case 'solving':
          dispatch({ type: 'SET_STATUS_TO_SEEING_ANSWER' });
          break;
        case 'seeingAnswer': {
          const currentProblem = selectors.deriveCurrentProblem(state);
          const score = selectors.deriveScore(state);
          const currentIndex = state.statusOfSolving.index;
          CourseUserIsLearningApi.reviewProblem(
            false,
            state.speGetPage.payload.courseUserIsLearning.id,
            currentProblem.id,
            score
          )
            .then(() => {
              const lastIndex = state.speGetPage.payload.problems.length - 1;
              const itWasLastReviewedProblem = lastIndex === currentIndex;
              if (itWasLastReviewedProblem) {
                commonFetch(
                  (spe) => dispatch({ type: 'SET_SPE_NEXT_REVIEW_IN', payload: spe }),
                  'GET', `/api/pages/courseActions/${currentProblem.courseId}`
                );
              }
            });
          if (score < 5) {
            dispatch({
              type: 'ADD_TO_FAILED_PROBLEMS',
              payload: currentIndex
            });
          }
          dispatch({
            type: 'CHANGE_AMOUNT_OF_PROBLEMS_TO_REVIEW_BY',
            payload: -1
          });
          dispatch({
            type: 'SET_NEXT_PROBLEM',
            payload: currentIndex + 1
          });

          IdsOfProblemsToLearnAndReviewPerCourseActions.deleteProblem(dispatch, currentProblem.id);
          break;
        }
      }
    }
  };

const enterPressedInFailedMode = () =>
  (dispatch, getState) => {
    const state = getState().pages.Page_courses_id_review;
    switch (state.statusOfSolving.status) {
      case 'solving':
        dispatch({ type: 'SET_STATUS_TO_SEEING_ANSWER' });
        break;
      case 'seeingAnswer': {
        const score = selectors.deriveScore(state);
        const currentIndex = state.statusOfSolving.index;

        dispatch({
          type: 'DELETE_FROM_FAILED_PROBLEMS',
          payload: currentIndex
        });

        // readd if it was bad again
        if (score < 5) {
          dispatch({
            type: 'ADD_TO_FAILED_PROBLEMS',
            payload: currentIndex
          });
        }

        const ifNextReReviewProblem = state.indexesOfFailedProblems[0];
        if (ifNextReReviewProblem) {
          dispatch({
            type: 'SET_NEXT_REREVIEW_PROBLEM'
          });
        } else {
          dispatch({
            type: 'SET_NEXT_PROBLEM',
            payload: -1 // ??? unsure
          });
        }
        break;
      }
    }
  };

const enterPressedInSimulatedReview = () =>
  (dispatch, getState) => {
    const state = getState().pages.Page_courses_id_review;
    if (state.ifReviewingFailedProblems) {
      enterPressedInFailedMode()(dispatch, getState);
    } else {
      switch (state.statusOfSolving.status) {
        case 'solving':
          dispatch({ type: 'SET_STATUS_TO_SEEING_ANSWER' });
          break;
        case 'seeingAnswer': {
          const score = selectors.deriveScore(state);
          const currentIndex = state.statusOfSolving.index;
          // readd if it was bad again
          if (score < 5) {
            dispatch({
              type: 'ADD_TO_FAILED_PROBLEMS',
              payload: currentIndex
            });
          }

          dispatch({
            type: 'SET_NEXT_PROBLEM',
            payload: state.statusOfSolving.index + 1
          });

          // if (smth) {
          //   setTimeout(() => {
          //     dispatch({
          //       type: 'SET_IF_WHATS_NEXT'
          //     })
          //   }, 600)
          // } else if (smth_else) {
          //   setTimeout(() => {
          //     dispatch({
          //       type: 'SET_IF_FAILED_PROBLEMS'
          //     })
          //   })
          // }
          break;
        }
      }
    }
  };

const getPage = (courseId, ifSimulated) =>
  (dispatch) =>
    commonFetch(
      (spe) => dispatch({ type: 'SET_SPE_GET_PAGE', payload: spe }),
      'GET',
      ifSimulated ? `/api/pages/courses/${courseId}/review/simulated` : `/api/pages/courses/${courseId}/review`
    );

export default { enterPressed, enterPressedInSimulatedReview, getPage };
