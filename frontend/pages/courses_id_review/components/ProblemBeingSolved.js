import React from 'react';

import { Problem } from '~/components/Problem';
import { SeparateAnswerSelfScore } from './SeparateAnswerSelfScore';

class ProblemBeingSolved extends React.Component {
  static propTypes = {
    problem: React.PropTypes.object.isRequired,
    statusOfSolving: React.PropTypes.object.isRequired,

    enterPressed: React.PropTypes.func.isRequired,
    separateAnswerSelfScoreGiven: React.PropTypes.func.isRequired
  }

  componentDidMount = () => {
    document.addEventListener('keydown', this.onEnter, false);
  }

  componentWillUnmount = () => {
    document.removeEventListener('keydown', this.onEnter);
  }

  onEnter = (event) => {
    if (event.key !== 'Enter') return;

    const achievesOnEnterSomeOtherWay =
      this.props.problem.type === 'separateAnswer' &&
      this.props.statusOfSolving.status === 'solving';

    if (!achievesOnEnterSomeOtherWay) {
      this.props.enterPressed();
    }
  }

  render = () =>
    <div>
      <Problem
        mode="solving"
        problemContent={this.props.problem.content}
        problemType={this.props.problem.type}
      />

      {
        this.props.statusOfSolving.status === 'seeingAnswer' &&
        this.props.problem.type === 'separateAnswer' &&
        <SeparateAnswerSelfScore
          giveScore={this.props.separateAnswerSelfScoreGiven}
          score={this.props.statusOfSolving.typeSpecific.selfScore}
        />
      }

      {
        this.props.statusOfSolving.status === 'seeingAnswer' &&
        <a className="button next" onClick={this.props.enterPressed}>
          NEXT
        </a>
      }
    </div>
}

const mapStateToProps = (state) => {
  const pageState = state.pages.Page_courses_id_review;
  return {
    statusOfSolving: pageState.statusOfSolving
  };
};
import { Page_courses_id_review_Actions } from '../reducer';
const { enterPressed } = Page_courses_id_review_Actions;
const mapDispatchToProps = (dispatch) => ({
  enterPressed: () => dispatch(enterPressed()),
  separateAnswerSelfScoreGiven: (selfScore) =>
    dispatch({
      type: 'SEPARATE_ANSWER_SELF_SCORE_GIVEN',
      payload: selfScore
    })
});

import { connect } from 'react-redux';
ProblemBeingSolved = connect(mapStateToProps, mapDispatchToProps)(ProblemBeingSolved);

export { ProblemBeingSolved };
