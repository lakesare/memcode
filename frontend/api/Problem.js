import { commonFetch } from './commonFetch';
import hashToQueryString from './services/hashToQueryString';

// params = { courseId }
const index = (dispatch, params = {}) =>
  commonFetch(dispatch,
    'GET', `/api/problems/?${hashToQueryString(params)}`
  );

const create = (dispatch, values) =>
  commonFetch(dispatch,
    'POST', '/api/problems',
    { problem: values }
  );

const createManyFromExcel = (dispatch, courseId, problems) =>
  commonFetch(dispatch,
    'POST', `/api/problems/createManyFromExcel`,
    { courseId, problems }
  );

const update = (dispatch, problemId, values) =>
  commonFetch(dispatch,
    'PUT', `/api/problems/${problemId}`,
    { problem: values }
  );

export default {
  create, update,
  index,
  createManyFromExcel
};
