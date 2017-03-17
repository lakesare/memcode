import { commonFetch } from './commonFetch';

// of authenticated user
// => [{
//   ...usual course object,
//   courseUserIsLearningId: 10,
//   amountOfDueProblems: 3
// }], active, filtered by amount of due problems
const getCoursesWithDueProblems = (dispatch) =>
  commonFetch(dispatch,
    'GET', '/api/coursesUserIsLearning/coursesWithDueProblems'
  );

const getDueProblems = (dispatch, id) =>
  commonFetch(dispatch,
    'GET', `/api/coursesUserIsLearning/${id}/dueProblems`
  );

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

const updateProblemScore = (dispatch, id, problemId, performanceRating) =>
  commonFetch(dispatch,
    'PUT', `/api/coursesUserIsLearning/${id}/updateProblemScore`,
    { problemId, performanceRating }
  )

export {
  getCoursesWithDueProblems, getDueProblems, create,
  stopLearning, resumeLearning,
  updateProblemScore
};
