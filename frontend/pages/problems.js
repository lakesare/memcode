import React from 'react';
import { connect } from 'react-redux';

import { Header }       from '../components/header';
import { ProblemsList } from '../components/problems';



const mapStateToProps = (state) => {
  return {
    problems: state.problems,
    answers: state.answers
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchProblems(courseId) {
      dispatch({ type: 'FETCHING_PROBLEMS', status: 'fetching' });
      fetch('/api/courses/1/problems').then(response => response.json() )
        .then((response) => {
          dispatch({ type: 'FETCHING_PROBLEMS', status: 'success', problems: response.problems, answers: response.answers });
      });
    },
  }
}

const ConnectedProblemsList = connect(
  mapStateToProps,
  mapDispatchToProps
)(ProblemsList);



const ProblemsPage = React.createClass({
  render() {
    return(
      <section className="row">
        <div className="small-11 small-centered column end">
          <Header/>
          <h1>Problems</h1>
          <ConnectedProblemsList/>
        </div>
      </section>
    )
  }
});


export { ProblemsPage };