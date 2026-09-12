import api from '~/api';
import MyDuck from '~/ducks/MyDuck';
import FailedFlashcardsDuck from '~/ducks/FailedFlashcardsDuck';

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
      enterPressedInFailedMode(true)(dispatch, getState);
    } else {
      const currentProblem = selectors.deriveCurrentProblem(state);
      switch (state.statusOfSolving.status) {
        case 'solving':
          dispatch({ type: 'SET_STATUS_TO_SEEING_ANSWER' });
          break;
        case 'seeingAnswer': {
          const score = selectors.deriveScore(state, getState().global.Settings.clozeDeletionMode);
          const currentIndex = state.statusOfSolving.index;
          api.post.ProblemUserIsLearningApi.reviewProblem(
            false,
            {
              id: state.speGetPage.payload.courseUserIsLearning.id,
              problemId: currentProblem.id,
              performanceRating: score
            }
          );
          // [claude comment] this review is recorded, so it is also what puts the flashcard on the red FAILED pile or takes it off again
          const FailedFlashcardsActions = FailedFlashcardsDuck.getActions(dispatch, getState);
          if (score < 5) {
            FailedFlashcardsActions.addProblem(currentProblem.courseId, currentProblem.id);
            dispatch({
              type: 'ADD_TO_FAILED_PROBLEMS',
              payload: currentIndex
            });
          } else {
            FailedFlashcardsActions.removeProblem(currentProblem.courseId, currentProblem.id);
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

const enterPressedInFailedMode = (ifTrackingFailedPile = false) =>
  (dispatch, getState) => {
    const state = getState().pages.Page_courses_id_review;
    switch (state.statusOfSolving.status) {
      case 'solving':
        dispatch({ type: 'SET_STATUS_TO_SEEING_ANSWER' });
        break;
      case 'seeingAnswer': {
        const currentProblem = selectors.deriveCurrentProblem(state);
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

        // [claude comment] the red FAILED pile follows this drill too, so getting a flashcard right by heart is what takes it off the pile - a test drive is the one review that leaves the pile alone
        if (ifTrackingFailedPile) {
          const FailedFlashcardsActions = FailedFlashcardsDuck.getActions(dispatch, getState);
          if (score < 5) {
            FailedFlashcardsActions.addProblem(currentProblem.courseId, currentProblem.id);
          } else {
            FailedFlashcardsActions.removeProblem(currentProblem.courseId, currentProblem.id);
          }
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
      enterPressedInFailedMode(isPersistentReview)(dispatch, getState);
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
            api.post.ProblemUserIsLearningApi.reviewProblem(
              false,
              {
                id: state.speGetPage.payload.courseUserIsLearning.id,
                problemId: currentProblem.id,
                performanceRating: score
              }
            );
            MyDuck.getActions(dispatch, getState).reviewProblem(currentProblem.courseId, currentProblem.id, score);
            FailedFlashcardsDuck.getActions(dispatch, getState).addProblem(currentProblem.courseId, currentProblem.id);
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

const getPage = (courseId, simulated, persistent, failed) =>
  (dispatch, getState) => {
    const setSpe = (spe) => dispatch({ type: 'SET_SPE_GET_PAGE', payload: spe });

    if (simulated) {
      return api.get.PageApi.getReviewSimulatedPage(setSpe, { courseId });
    } else if (persistent) {
      return api.get.PageApi.getReviewPersistentPage(setSpe, { courseId });
    } else if (failed) {
      // [claude comment] the pile lives in this browser, so its ids travel to the server rather than the other way round - POST because a query string can't carry an array
      const problemIds = FailedFlashcardsDuck.getProblemIds(getState().global.FailedFlashcards, courseId);

      return api.post.PageApi.getReviewFailedPage(setSpe, { courseId, problemIds })
        .then((payload) => {
          // [claude comment] flashcards deleted or ignored since they were failed never come back from the server - drop them here, or the red count could never reach zero
          const returnedIds = payload.problems.map((problem) => problem.id);
          const FailedFlashcardsActions = FailedFlashcardsDuck.getActions(dispatch, getState);

          problemIds
            .filter((problemId) => !returnedIds.includes(problemId))
            .forEach((problemId) => FailedFlashcardsActions.removeProblem(courseId, problemId));
        });
    } else {
      return api.get.PageApi.getReviewPage(setSpe, { courseId });
    }
  };

export default { enterPressed, enterPressedInSimulatedReview, enterPressedInPersistentReview, getPage, ignoreCurrentFlashcard };
