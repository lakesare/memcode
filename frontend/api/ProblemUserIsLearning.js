import { commonFetch } from './commonFetch';

const create = (dispatch, problemId) =>
  commonFetch(dispatch,
    'POST', `/api/problemsUserIsLearning`,
    { problemId }
  );

const ddelete = (dispatch, id) =>
  commonFetch(dispatch,
    'DELETE', `/api/problemsUserIsLearning/${id}`
  );

const ignore = (dispatch, id) =>
  commonFetch(dispatch,
    'PUT', `/api/problemsUserIsLearning/${id}/ignore`
  );

export {
  create, ddelete, ignore
};
