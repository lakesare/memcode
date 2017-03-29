import { commonFetch } from './commonFetch';

const getAllByCourseId = (dispatch, courseId) =>
  commonFetch(dispatch,
    'GET', `/api/problems/allByCourseId/${courseId}`
  );

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

// import * as ProblemApi from '~/api/Problem';
export { getAllByCourseId, create, update, destroy };
