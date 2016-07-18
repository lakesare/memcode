import { connect } from 'react-redux';
import React from 'react';

import { Header }      from '../components/header';
import { CoursesList } from '../components/courses';



const mapStateToProps = (state) => {
  return {
    courses: state.courses
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchCourses() {
      dispatch({ type: 'FETCHING_COURSES', status: 'fetching' });
      fetch('./api/courses').then(response => response.json() )
        .then((response) => {
          dispatch({ type: 'FETCHING_COURSES', status: 'success', items: response });
      });
    },
  }
};

const ConnectedCourses = connect(
  mapStateToProps,
  mapDispatchToProps
)(CoursesList);


const CoursesPage = React.createClass({
  render() {
    const courses = [];
    return(
      <section>
        <Header/>
        <h1>Courses</h1>
        <ConnectedCourses/>
      </section>
    )
  }
});


export { CoursesPage };