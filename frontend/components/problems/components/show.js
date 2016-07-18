import React from 'react';
import { AnswersList } from '../../answers';

const Show = React.createClass({

  propTypes: {
    // problem: React.PropTypes.object.isRequired,
    // answers: React.PropTypes.arrayOf(React.PropTypes.object).isRequired
  },

  render() {
    console.log('problem rendered');

    return(
      <div>
        <AnswersList answers={this.props.answers}/>
        <div>
          {this.props.problem.explanation}
        </div>
      </div>
    );
  }


});

export { Show };