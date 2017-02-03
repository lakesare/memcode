import { browserHistory } from 'react-router';

const createCourseCreator = (dispatch) => ((values) => {
  dispatch({ type: 'CREATING_COURSE', status: 'fetching' });
  fetch("/api/courses", {
    method: 'POST',
    body: JSON.stringify(values),
    headers: new Headers({ "Content-Type": "application/json" })
  }).then(response => response.json() )
    .then((response) => {
      browserHistory.push(`/courses/${response.data.courseId}`);
      dispatch({
        type: 'CREATING_COURSE', 
        status: 'success'
      });
  }).catch((response) => {
      dispatch({
        type: 'CREATING_COURSE',
        status: 'error',
        error: response.error
      })
  })
})






export { createCourseCreator };