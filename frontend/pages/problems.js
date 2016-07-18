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

const ConnectedProblemsList = connect(
  mapStateToProps
)(ProblemsList);



const ProblemsPage = React.createClass({
  render() {
    return(
      <section>
        <Header/>
        <h1>Problems</h1>
        <ConnectedProblemsList/>
      </section>
    )
  }
});


export { ProblemsPage };