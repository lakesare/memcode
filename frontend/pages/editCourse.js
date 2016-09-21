import React from 'react';
import { connect } from 'react-redux';

import { Header } from '../components/header';
import { NewCourse } from '../components/courses'

import { fetchCourseWithProblemsCreator, updateCourseCreator } from '../components/courses/actions';

import { problemContentToTextarea } from '../services/problemContentToTextarea'

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onSubmit: updateCourseCreator(dispatch, ownProps.courseId),
    seedData: fetchCourseWithProblemsCreator(dispatch, ownProps.courseId)
  }
};

const mapStateToProps = (state) => {
  const problems = state.problems.items.map((problem) => {
    return { 
      ...problem, 
      content: problemContentToTextarea(problem.content)
    }
  });

  return {
    initialValues: {
      course: state.courses.course.items, 
      problems: problems
    }
  }
}

const ConnectedNewCourse = connect(
  mapStateToProps,
  mapDispatchToProps
)(NewCourse);




const EditCoursePage = React.createClass({
  render() {
    return(
      <section>
        <Header/>

        <div className="row">
          <div className="small-12 column">
            <h1>Edit course</h1>
            <ConnectedNewCourse courseId={this.props.params.id}/>
          </div>
        </div>
      </section>
    )
  }
});



export { EditCoursePage };