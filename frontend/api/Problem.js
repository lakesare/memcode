import { commonFetch } from './commonFetch';

const create = (dispatch, values) =>
  commonFetch(dispatch,
    'POST', '/api/problems',
    { problem: values }
  );

const update = (dispatch, problemId, values) =>
  commonFetch(dispatch,
    'PUT', `/api/problems/${problemId}`,
    { problem: values }
  );

const destroy = (dispatch, problemId) =>
  commonFetch(dispatch,
    'DELETE', `/api/problems/${problemId}`
  );

const moveToCourse = (dispatch, problemId, courseId) =>
  commonFetch(dispatch,
    'POST', `/api/problems/moveToCourse`,
    { problemId, courseId }
  );

// import * as ProblemApi from '~/api/Problem';
export { create, update, destroy, moveToCourse };
