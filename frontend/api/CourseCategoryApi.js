import { commonFetch } from './commonFetch';
// import hashToQueryString from './services/hashToQueryString';

const selectWithGroups = (dispatch) =>
  commonFetch(dispatch,
    'GET', '/api/courseCategories/withGroups'
  );

const seed = (dispatch) =>
  commonFetch(dispatch,
    'GET', '/api/courseCategories/seed'
  );

window.seed = seed;

export default {
  selectWithGroups
};
