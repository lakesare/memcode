import api from '~/api';
import commonFetch from '~/api/commonFetch';
import MyDuck from '~/ducks/MyDuck';

import selectors from './selectors';

import playShortSound from './services/playShortSound';
import playLongSound from './services/playLongSound';

const enterPressed = () =>
  (dispatch, getState) => {
    // Do not react to ENTER if we're inside of the draft editor
    if (document.querySelector('.draft-answer .ql-editor.focus-visible')) {
      return true;
    }

    const state = getState().pages.Page_courses_id_review;
    if (state.ifReviewingFailedProblems) {
      enterPressedInFailedMode()(dispatch, getState);
    } else {
      const currentProblem = selectors.deriveCurrentProblem(state);
      switch (state.statusOfSolving.status) {
        case 'solving':
          dispatch({ type: 'SET_STATUS_TO_SEEING_ANSWER' });
          if (currentProblem.type === 'separateAnswer') {
            playShortSound();
          }
          break;
        case 'seeingAnswer': {
          const score = selectors.deriveScore(state);
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
          playLongSound(score, currentProblem);
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
        if (currentProblem.type === 'separateAnswer') {
          playShortSound();
        }
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
        playLongSound(score, currentProblem);

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
          if (currentProblem.type === 'separateAnswer') {
            playShortSound();
          }
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

          playLongSound(score, currentProblem);
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
    let url;
    if (simulated) {
      url = `/api/pages/courses/${courseId}/review/simulated`;
    } else if (persistent) {
      url = `/api/pages/courses/${courseId}/review/persistent`;
    } else {
      url = `/api/pages/courses/${courseId}/review`;
    }
    return commonFetch(
      (spe) => dispatch({ type: 'SET_SPE_GET_PAGE', payload: spe }),
      'GET', url
    );
  };

export default { enterPressed, enterPressedInSimulatedReview, enterPressedInPersistentReview, getPage };
