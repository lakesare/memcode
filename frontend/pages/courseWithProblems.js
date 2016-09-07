import React from 'react';
import { connect } from 'react-redux';

import { Header }       from '../components/header';
import { ProblemsList } from '../components/problems';


const mapStateToProps = (state) => {
  return {
    problems: state.problems,
    course:   state.courses.course
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    fetchProblems() {
      dispatch({ 
        type: 'FETCHING_PROBLEMS', 
        status: 'fetching' 
      });
      dispatch({ 
        type: 'FETCHING_COURSE', 
        status: 'fetching'
      });
      fetch(`/api/courses/${ownProps.courseId}`)
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
    },
  }
}

const ConnectedProblemsList = connect(
  mapStateToProps,
  mapDispatchToProps
)(ProblemsList);



const CourseWithProblemsPage = React.createClass({
  render() {
    return(
      <section className="row">
        <div className="small-11 small-centered column end">
          <Header/>
          <ConnectedProblemsList courseId={this.props.params.id}/>
        </div>
      </section>
    )
  }
});


export { CourseWithProblemsPage };