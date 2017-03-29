import { commonFetch } from './commonFetch';

const index = (dispatch) =>
  commonFetch(dispatch,
    'GET', '/api/courses'
  );

const selectAllLearned = (dispatch) =>
  commonFetch(dispatch,
    'GET', '/api/courses/allLearned'
  );

const selectAllCreated = (dispatch) =>
  commonFetch(dispatch,
    'GET', '/api/courses/allCreated'
  );

const show = (dispatch, courseId) =>
  commonFetch(dispatch,
    'GET', `/api/courses/${courseId}`
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
  index, show, create, update, destroy,
  selectAllLearned, selectAllCreated
};
