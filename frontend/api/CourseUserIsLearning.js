import { commonFetch } from './commonFetch';

const create = (dispatch, courseId) =>
  commonFetch(dispatch,
    'POST', '/api/coursesUserIsLearning',
    { courseId }
  );

const stopLearning   = (dispatch, id) =>
  commonFetch(dispatch,
    'PUT', `/api/coursesUserIsLearning/${id}/stopLearning`
  );

const resumeLearning = (dispatch, id) =>
  commonFetch(dispatch,
    'PUT', `/api/coursesUserIsLearning/${id}/resumeLearning`
  );

const learnProblem = (dispatch, id, problemId) =>
  commonFetch(dispatch,
    'POST', `/api/coursesUserIsLearning/${id}/problems/${problemId}/learn`
  );

const reviewProblem = (dispatch, id, problemId, performanceRating) =>
  commonFetch(dispatch,
    'PUT', `/api/coursesUserIsLearning/${id}/problems/${problemId}/review`,
    { performanceRating }
  );

const getProblemsToLearn = (dispatch, id) =>
  commonFetch(dispatch,
    'GET', `/api/coursesUserIsLearning/${id}/problemsToLearn`
  );

const getProblemsToReview = (dispatch, id) =>
  commonFetch(dispatch,
    'GET', `/api/coursesUserIsLearning/${id}/problemsToReview`
  );

export {
  create,
  stopLearning, resumeLearning,
  learnProblem, reviewProblem,
  getProblemsToLearn, getProblemsToReview
};

export default {
  create,
  stopLearning, resumeLearning,
  learnProblem, reviewProblem,
  getProblemsToLearn, getProblemsToReview
};
