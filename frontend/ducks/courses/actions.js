import * as spe from '~/services/spe';

const apiCreateCourse = (dispatch, values) => {
  dispatch(spe.request());
  return fetch('/api/courses', {
    method: 'POST',
    body: JSON.stringify(values),
    headers: new Headers({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('jwt')
    })
  })
    .then(response => response.json())
    .then((response) => {
      dispatch(spe.success(response));
      return Promise.resolve(response);
    })
    .catch((error) => {
      dispatch(spe.failure(error.error));
      return Promise.reject(error);
    });
};

const apiGetCourses = (dispatch) => {
  dispatch(spe.request());
  return (
    fetch('/api/courses')
      .then(response => response.json())
      .then((response) => {
        dispatch(spe.success(response));
        return Promise.resolve(response);
      })
      .catch((error) => {
        dispatch(spe.failure(error.error));
        return Promise.reject(error);
      })
  );
};

const apiDeleteCourse = (dispatch, courseId) => {
  dispatch(spe.request());
  return fetch(`/api/courses/${courseId}`, {
    method: 'DELETE'
  })
    .then((response) => {
      dispatch(spe.success(response));
      return Promise.resolve(response);
    })
    .catch((error) => {
      dispatch(spe.failure(error.error));
      return Promise.reject(error);
    });
};

const apiGetCourse = (dispatch, courseId) => {
  dispatch(spe.request());
  return (
    fetch(`/api/courses/${courseId}`)
      .then(response => response.json())
      .then((response) => {
        const data = {
          problems: response.data.problems,
          course: response.data.course
        };
        dispatch(spe.success(data));
        return Promise.resolve(data);
      })
      .catch((error) => {
        dispatch(spe.failure(error.error));
        return Promise.reject(error);
      })
  );
};

const apiUpdateCourse = (dispatch, courseId, values) => {
  dispatch(spe.request());
  fetch(`/api/courses/${courseId}`, {
    method: 'PUT',
    body: JSON.stringify(values),
    headers: new Headers({ 'Content-Type': 'application/json' })
  })
    .then(response => response.json())
    .then((response) => {
      dispatch(spe.success(response));
      return Promise.resolve(response);
    })
    .catch((error) => {
      dispatch(spe.failure(error.error));
      return Promise.reject(error);
    });
};

export { apiCreateCourse, apiGetCourses, apiDeleteCourse, apiGetCourse, apiUpdateCourse };
