import api from '~/api';
import MyDuck from '~/ducks/MyDuck';

import selectors from './selectors';

const ignoreCurrentFlashcard = () =>
  (dispatch, getState) => {
    const state = getState().pages.Page_courses_id_review;
    const currentIndex = state.statusOfSolving.index;
    if (state.ifReviewingFailedProblems) {
      dispatch({
        type: 'DELETE_FROM_FAILED_PROBLEMS',
        payload: currentIndex
      });

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
    } else {
      dispatch({
        type: 'SET_NEXT_PROBLEM',
        payload: currentIndex + 1
      });
    }
  }

const enterPressed = () =>
  (dispatch, getState) => {
    const state = getState().pages.Page_courses_id_review;
    if (state.ifReviewingFailedProblems) {
      enterPressedInFailedMode()(dispatch, getState);
    } else {
      const currentProblem = selectors.deriveCurrentProblem(state);
      switch (state.statusOfSolving.status) {
        case 'solving':
          dispatch({ type: 'SET_STATUS_TO_SEEING_ANSWER' });
          break;
        case 'seeingAnswer': {
          const score = selectors.deriveScore(state, getState().global.Settings.clozeDeletionMode);
          const currentIndex = state.statusOfSolving.index;
          api.ProblemUserIsLearningApi.reviewProblem(
            false,
            {
              id: state.speGetPage.payload.courseUserIsLearning.id,
              problemId: currentProblem.id,
              performanceRating: score
            }
          );
          if (score < 5) {
            dispatch({
              type: 'ADD_TO_FAILED_PROBLEMS',
              payload: currentIndex
            });
          }
          dispatch({
            type: 'SET_NEXT_PROBLEM',
            payload: currentIndex + 1
          });

          MyDuck.getActions(dispatch, getState).reviewProblem(currentProblem.courseId, currentProblem.id, score);
          break;
        }
      }
    }
  };

const enterPressedInFailedMode = () =>
  (dispatch, getState) => {
    const state = getState().pages.Page_courses_id_review;
    const currentProblem = selectors.deriveCurrentProblem(state);
    switch (state.statusOfSolving.status) {
      case 'solving':
        dispatch({ type: 'SET_STATUS_TO_SEEING_ANSWER' });
        break;
      case 'seeingAnswer': {
        const score = selectors.deriveScore(state, getState().global.Settings.clozeDeletionMode);
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

const enterPressedInPersistentReview = () => {
  // basically a mix between simulated review and real review
  // if score = 5 -> like simulated
  // if score < 5 -> like real review -> report to api
  return enterPressedInSimulatedReview(true);
};

const enterPressedInSimulatedReview = (isPersistentReview = false) =>
  (dispatch, getState) => {
    const state = getState().pages.Page_courses_id_review;
    if (state.ifReviewingFailedProblems) {
      enterPressedInFailedMode()(dispatch, getState);
    } else {
      const currentProblem = selectors.deriveCurrentProblem(state);
      switch (state.statusOfSolving.status) {
        case 'solving':
          dispatch({ type: 'SET_STATUS_TO_SEEING_ANSWER' });
          break;
        case 'seeingAnswer': {
          const score = selectors.deriveScore(state, getState().global.Settings.clozeDeletionMode);
          const currentIndex = state.statusOfSolving.index;
          // readd if it was bad again
          if (score < 5) {
            dispatch({
              type: 'ADD_TO_FAILED_PROBLEMS',
              payload: currentIndex
            });
          }

          if (isPersistentReview && score < 5) {
            api.ProblemUserIsLearningApi.reviewProblem(
              false,
              {
                id: state.speGetPage.payload.courseUserIsLearning.id,
                problemId: currentProblem.id,
                performanceRating: score
              }
            );
            MyDuck.getActions(dispatch, getState).reviewProblem(currentProblem.courseId, currentProblem.id, score);
          }

          dispatch({
            type: 'SET_NEXT_PROBLEM',
            payload: state.statusOfSolving.index + 1
          });
          break;
        }
      }
    }
  };

const getPage = (courseId, simulated, persistent) =>
  (dispatch) => {
    let apiMethod;
    if (simulated) {
      apiMethod = api.get.PageApi.getReviewSimulatedPage;
    } else if (persistent) {
      apiMethod = api.get.PageApi.getReviewPersistentPage;
    } else {
      apiMethod = api.get.PageApi.getReviewPage;
    }
    return apiMethod(
      (spe) => dispatch({ type: 'SET_SPE_GET_PAGE', payload: spe }),
      { courseId }
    );
  };

export default { enterPressed, enterPressedInSimulatedReview, enterPressedInPersistentReview, getPage, ignoreCurrentFlashcard };
