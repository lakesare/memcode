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

// solve with some score 0..1
const solve = (dispatch, problemId, score) =>
  commonFetch(dispatch,
    'POST',  `/api/problems/${problemId}/solve`,
    { score }
  );

// import * as ProblemApi from '~/api/Problem';
export { create, update, destroy, solve };
