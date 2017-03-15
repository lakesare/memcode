import { commonFetch } from './commonFetch';

// of authenticated user
// => [{
//   ...usual course object,
//   courseUserIsLearningId: 10,
//   amountOfDueProblems: 3
// }], active, filtered by amount of due problems
const coursesWithDueProblems = (dispatch) =>
  commonFetch(dispatch,
    'GET', '/api/coursesUserIsLearning/coursesWithDueProblems'
  );

export { coursesWithDueProblems };
