import api from '~/api';
import commonFetch from '~/api/commonFetch';
import MyDuck from '~/ducks/MyDuck';

import selectors from './selectors';

import playShortSound from './services/playShortSound';

const enterPressed = () =>
  (dispatch, getState) => {
    // Do not react to ENTER if we're inside of the draf editor
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
          // if (currentProblem.type === 'separateAnswer') {
          //   playShortSound();
          // }
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
          currentProblem.type === 'separateAnswer' && playShortSound(score, currentProblem);
          dispatch({
            type: 'SET_NEXT_PROBLEM',
            payload: currentIndex + 1
          });

          MyDuck.getActions(dispatch, getState).reviewProblem(currentProblem.courseId, currentProblem.id);
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
        currentProblem.type === 'separateAnswer' && playShortSound(score, currentProblem);

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
          currentProblem.type === 'separateAnswer' && playShortSound(score, currentProblem);

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
