import { IdsOfProblemsToLearnAndReviewPerCourseActions } from '~/reducers/IdsOfProblemsToLearnAndReviewPerCourse';
import * as CourseUserIsLearningApi from '~/api/CourseUserIsLearning';
import { commonFetch } from '~/api/commonFetch';

import selectors from './selectors';


const enterPressed = () =>
  (dispatch, getState) => {
    const state = getState().pages.Page_courses_id_review;
    switch (state.statusOfSolving.status) {
      case 'solving':
        dispatch({ type: 'SET_STATUS_TO_SEEING_ANSWER' });
        break;
      case 'seeingAnswer': {
        const currentProblem = selectors.deriveCurrentProblem(state);
        CourseUserIsLearningApi.reviewProblem(
          false,
          state.speGetPage.payload.courseUserIsLearning.id,
          currentProblem.id,
          selectors.deriveScore(state)
        )
          .then(() => {
            const lastIndex = state.speGetPage.payload.problems.length - 1;
            const currentIndex = state.statusOfSolving.index;
            const itWasLastReviewedProblem = lastIndex === currentIndex;
            if (itWasLastReviewedProblem) {
              commonFetch(
                (spe) => dispatch({ type: 'SET_SPE_NEXT_REVIEW_IN', payload: spe }),
                'GET', `/api/pages/courseActions/${currentProblem.courseId}`
              );
            }
          });
        dispatch({
          type: 'CHANGE_AMOUNT_OF_PROBLEMS_TO_REVIEW_BY',
          payload: -1
        });
        dispatch({
          type: 'SET_NEXT_PROBLEM',
          payload: state.statusOfSolving.index + 1
        });
        IdsOfProblemsToLearnAndReviewPerCourseActions.deleteProblem(dispatch, currentProblem.id);
        break;
      }
    }
  };

const enterPressedInSimulatedReview = () =>
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
  };

const getPage = (courseId, ifSimulated) =>
  (dispatch) =>
    commonFetch(
      (spe) => dispatch({ type: 'SET_SPE_GET_PAGE', payload: spe }),
      'GET',
      ifSimulated ? `/api/pages/courses/${courseId}/review/simulated` : `/api/pages/courses/${courseId}/review`
    );

export default { enterPressed, enterPressedInSimulatedReview, getPage };
