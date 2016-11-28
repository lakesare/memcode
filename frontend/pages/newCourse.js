import React from 'react';

import { Header } from '../components/header';
import { NewCourse } from '../components/courses'
import css from './css/newCourse.scss';


const NewCoursePage = React.createClass({
  render() {
    return(
      <section>
        <Header/>

        <div className="row">
          <div className="small-12 column">
            <h1>New course</h1>
            <ConnectedNewCourse/>
          </div>
        </div>
      </section>
    )
  }
});

import { connect } from 'react-redux';
import { createCourseCreator } from '../components/courses/actions';
const mapDispatchToProps = (dispatch) => {
  return {
    onSubmit: createCourseCreator(dispatch)
  }
}

const ConnectedNewCourse = connect(
  ()=>({}),
  mapDispatchToProps
)(NewCourse);

export { NewCoursePage };