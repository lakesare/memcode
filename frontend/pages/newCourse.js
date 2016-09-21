import React from 'react';
import { connect } from 'react-redux';

import { Header } from '../components/header';
import { NewCourse } from '../components/courses'
import css from './newCourse.scss';
import { createCourseCreator } from '../components/courses/actions';


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