import React from 'react';
import { connect } from 'react-redux';

import { AnswersShow } from '../../answers'
import css from '../css/show.scss';
import { problemContentToJsx } from '../../../services/problemContentToJsx'

let Show = React.createClass({
  propTypes: {
    problem: React.PropTypes.object.isRequired,
    index:   React.PropTypes.number.isRequired // just for pretiness, to number down the problems
  },

  render() {
    return(
      <div className={css.problem + ' row'}>
        <div className="columns small-1">{this.props.index + 1}</div>

        <div className="columns small-6">
          {problemContentToJsx(this.props.problem.content, this.props.problem.id)}
        </div>

        <div className={css.context + " columns small-4"}>
          {this.props.problem.explanation}
        </div>

        <div className="columns small-1">
          <div className="button alert" onClick={this.props.deleteProblem}>delete</div>
        </div>
      </div>
    );
  }
});

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    deleteProblem: () => {
      const problemId = ownProps.problem.id;
      dispatch({ type: 'DELETING_PROBLEM', status: 'fetching', problemId });
      fetch(`/api/problems/${problemId}`, {
        method: "DELETE"
      }).then(() => {
        dispatch({ type: 'DELETING_PROBLEM', status: 'success', problemId });
      }).catch(() => {
        dispatch({ type: 'DELETING_PROBLEM', status: 'failure' });
      })
    },
  }
}

Show = connect(
  () => ({}),
  mapDispatchToProps
)(Show)

export { Show };