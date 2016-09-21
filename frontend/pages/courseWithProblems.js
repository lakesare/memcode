import React from 'react';
import { connect } from 'react-redux';

import { Header }       from '../components/header';
import { ProblemsList } from '../components/problems';

import { fetchCourseWithProblemsCreator } from '../components/courses/actions';


const mapStateToProps = (state) => {
  return {
    problems: state.problems,
    course:   state.courses.course
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    fetchCourseWithProblems: fetchCourseWithProblemsCreator(dispatch, ownProps.courseId)
  }
}

const ConnectedProblemsList = connect(
  mapStateToProps,
  mapDispatchToProps
)(ProblemsList);



const CourseWithProblemsPage = React.createClass({
  render() {
    return(
      <section>
        <Header/>
        <div className="row">
          <div className="small-12 column">
            <ConnectedProblemsList courseId={this.props.params.id}/>
          </div>
        </div>
      </section>
    )
  }
});


export { CourseWithProblemsPage };