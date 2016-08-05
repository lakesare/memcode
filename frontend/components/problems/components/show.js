import React from 'react';
import { AnswersList } from '../../answers';
import css from './show.scss';

const Show = React.createClass({

  propTypes: {
    problem: React.PropTypes.object.isRequired,
    index:   React.PropTypes.number.isRequired
  },

  render() {
    console.log('problem rendered');

    return(
      <div className={css.problem + ' row'}>
        <div className="columns small-1">{this.props.index + 1}</div>
        <AnswersList answers={this.props.problem.content} problemId={this.props.problem.id}/>
        <div className={css.context + " columns small-4"}>
          {this.props.problem.explanation}
        </div>
      </div>
    );
  }


});

export { Show };