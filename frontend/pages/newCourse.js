import React from 'react';
import { connect } from 'react-redux';

import { Header } from '../components/header';
import { NewCourse } from '../components/courses'
import css from './newCourse.scss';


const NewCoursePage = React.createClass({
  render() {
    return(
      <section className="row">
        <div className="small-11 small-centered column end">
          <Header/>

          <h1>New course</h1>
          <ConnectedNewCourse/>
        </div>
      </section>
    )
  }
});

const mapDispatchToProps = (dispatch) => {
  return {
    onSubmit: (values) => {
      dispatch({ type: 'CREATING_COURSE', status: 'fetching' });
      fetch("/api/courses", {
          method: 'POST',
          body: JSON.stringify(values),
          headers: new Headers({ "Content-Type": "application/json" })
        })
        .then(response => response.json() )
        .then((response) => {
          dispatch({
            type: 'CREATING_COURSE', 
            status: 'success', 
            courseId: response.courseId
          });
        })
        .catch((response) => {
          dispatch({
            type: 'CREATING_COURSE',
            status: 'error'
          })
        })
    }
  }
}

const ConnectedNewCourse = connect(
  ()=>({}),
  mapDispatchToProps
)(NewCourse);

export { NewCoursePage };