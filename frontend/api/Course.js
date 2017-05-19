import { commonFetch } from './commonFetch';

const selectAllLearned = (dispatch) =>
  commonFetch(dispatch,
    'GET', '/api/courses/allLearned'
  );

const selectAllCreated = (dispatch) =>
  commonFetch(dispatch,
    'GET', '/api/courses/allCreated'
  );

const create = (dispatch, values) =>
  commonFetch(dispatch,
    'POST', '/api/courses',
    { course: values }
  );

const update = (dispatch, courseId, values) =>
  commonFetch(dispatch,
    'PUT', `/api/courses/${courseId}`,
    { course: values }
  );

const destroy = (dispatch, courseId) =>
  commonFetch(dispatch,
    'DELETE', `/api/courses/${courseId}`
  );

export {
  create, update, destroy,
  selectAllLearned, selectAllCreated
};
