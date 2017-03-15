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
    'post', '/api/coursesUserIsLearning',
    { courseId }
  );

export { getCoursesWithDueProblems, getDueProblems, create };
