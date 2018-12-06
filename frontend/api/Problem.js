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

const reorderMany = (dispatch, values) =>
  commonFetch(dispatch,
    'PUT', `/api/problems/reorderMany`,
    { idToPositionMaps: values }
  );

const deleteMany = (dispatch, problemIds) =>
  commonFetch(dispatch,
    'DELETE', '/api/problems/deleteMany',
    { problemIds }
  );

const moveToCourseMany = (dispatch, problemIds, courseId) =>
  commonFetch(dispatch,
    'POST', `/api/problems/moveToCourseMany`,
    { problemIds, courseId }
  );


// import * as ProblemApi from '~/api/Problem';
export { create, update, deleteMany, moveToCourseMany };

export default {
  index,
  createManyFromExcel,
  reorderMany
};
