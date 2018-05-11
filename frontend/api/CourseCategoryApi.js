import { commonFetch } from './commonFetch';
import hashToQueryString from './services/hashToQueryString';

const selectWithGroups = (dispatch) =>
  commonFetch(dispatch,
    'GET', '/api/courseCategories/withGroups'
  );

// const seed = (dispatch) =>
//   commonFetch(dispatch,
//     'GET', '/api/courseCategories/seed'
//   );

// const selectWithGroupsForUserLearning = (dispatch, userId) =>
//   commonFetch(dispatch,
//     'GET', `/api/courseCategories/withGroupsForUserLearning?${hashToQueryString({ userId })}`
//   );

export default {
  selectWithGroups //, selectWithGroupsForUserLearning
};
