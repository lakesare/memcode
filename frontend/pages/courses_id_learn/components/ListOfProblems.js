import React from 'react';

import { Problem } from '~/components/Problem';

import * as CourseUserIsLearningApi from '~/api/CourseUserIsLearning';

class ListOfProblems extends React.Component {
  static propTypes = {
    problems: React.PropTypes.array.isRequired,
    courseUserIsLearningId: React.PropTypes.number.isRequired,
    changeAmountOfProblemsToLearnBy: React.PropTypes.func.isRequired,
    changeAmountOfProblemsToReviewBy: React.PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      idsOfLearnedProblems: []
    };
  }

  apiLearn = (problemId) => {
    CourseUserIsLearningApi.learnProblem(
      () => {},
      this.props.courseUserIsLearningId, problemId
    );
    this.markProblemAsLearned(problemId);
    this.props.changeAmountOfProblemsToLearnBy(-1);
    this.props.changeAmountOfProblemsToReviewBy(1);
  }

  markProblemAsLearned = (problemId) =>
    this.setState({
      idsOfLearnedProblems: [...this.state.idsOfLearnedProblems, problemId]
    })

  ifProblemIsLearned = (problemId) =>
    this.state.idsOfLearnedProblems.includes(problemId)

  renderProblem = (problem) =>
    <Problem
      mode="viewing"
      initialContentEditorState={problem.content}
      initialExplanationEditorState={problem.explanation}
    />

  renderProblemWrapper = (problem) => {
    if (this.ifProblemIsLearned(problem.id)) {
      return <div key={problem.id} className="problem-wrapper -learned">
        {this.renderProblem(problem)}
      </div>;
    } else {
      return <div key={problem.id} className="problem-wrapper" onClick={() => this.apiLearn(problem.id)}>
        {this.renderProblem(problem)}
      </div>;
    }
  }

  render = () =>
    <section className="problems">
      {this.props.problems.map(this.renderProblemWrapper)}
    </section>
}

import { connect } from 'react-redux';
ListOfProblems = connect(
  () => ({}),
  (dispatch) => ({
    changeAmountOfProblemsToLearnBy: (by) => dispatch({
      type: 'CHANGE_AMOUNT_OF_PROBLEMS_TO_LEARN_BY',
      payload: by
    }),
    changeAmountOfProblemsToReviewBy: (by) => dispatch({
      type: 'CHANGE_AMOUNT_OF_PROBLEMS_TO_REVIEW_BY',
      payload: by
    })
  })
)(ListOfProblems);

export { ListOfProblems };
