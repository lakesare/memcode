import { browserHistory } from 'react-router';

const fetchCourseWithProblemsCreator = (dispatch, courseId) => {
  return(
    () => {
      dispatch({
        type: 'FETCHING_PROBLEMS', 
        status: 'fetching' 
      });
      dispatch({ 
        type: 'FETCHING_COURSE', 
        status: 'fetching'
      });
      fetch(`/api/courses/${courseId}`)
        .then(response => response.json() )
        .then((response) => {
          dispatch({
            type: 'FETCHING_PROBLEMS', 
            status: 'success',
            problems: response.data.problems
          });
          dispatch({
            type: 'FETCHING_COURSE', 
            status: 'success',
            course: response.data.course
          });
      });
    }
  )
}



const createCourseCreator = (dispatch) => {
  return(
    (values) => {
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
      })//fetch
    }//funtion returned
  )//return
}


const updateCourseCreator = (dispatch, courseId) => {
  return(
    (values) => {
      dispatch({ type: 'UPDATING_COURSE', status: 'fetching' });
      fetch(`/api/courses/${courseId}`, {
        method: 'PUT',
        body: JSON.stringify(values),
        headers: new Headers({ "Content-Type": "application/json" })
      }).then(response => response.json() )
        .then((response) => {
          browserHistory.push(`/courses/${courseId}`);
          dispatch({
            type: 'UPDATING_COURSE', 
            status: 'success'
          });
      }).catch((response) => {
          dispatch({
            type: 'UPDATING_COURSE',
            status: 'error',
            error: response.error
          })
      })//fetch
    }//funtion returned
  )//return
}





export { fetchCourseWithProblemsCreator, createCourseCreator, updateCourseCreator };