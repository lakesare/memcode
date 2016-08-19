import React from 'react';
import { AnswersShow } from '../../answers'
import css from './show.scss';
import { problemContentToJsx } from '../../../services/problemContentToJsx'

const Show = React.createClass({
  propTypes: {
    problem: React.PropTypes.object.isRequired,
    index:   React.PropTypes.number.isRequired
  },

  render() {
    return(
      <div className={css.problem + ' row'}>
        <div className="columns small-1">{this.props.index + 1}</div>

        <div className="columns small-7">
          {problemContentToJsx(this.props.problem.content, this.props.problem.id)}
        </div>

        <div className={css.context + " columns small-4"}>
          {this.props.problem.explanation}
        </div>
      </div>
    );
  }
});

export { Show };