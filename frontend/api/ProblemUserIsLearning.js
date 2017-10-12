import { commonFetch } from './commonFetch';

const learn = (dispatch, problemId) =>
  commonFetch(dispatch,
    'POST', `/api/problemUserIsLearning/learn/${problemId}`
  );

const ignore = (dispatch, problemId) =>
  commonFetch(dispatch,
    'PUT', `/api/problemUserIsLearning/ignore/${problemId}`
  );

export {
  learn, ignore
};
