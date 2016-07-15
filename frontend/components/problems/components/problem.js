import React from 'react';
import { Answer } from '../../answers/components/answer.js'

const Problem = React.createClass({

  propTypes() {
    problem: React.PropTypes.object.isRequired
  },

  render() {
    console.log('problem rendered');
    let listOfAnswers = [];
    this.props.answers.map((answer) => {
      listOfAnswers.push(answer.precedingText);
      listOfAnswers.push(<Answer id={answer.id} key={answer.id} store={this.props.store} answer={answer} />);
    });
    return(
      <div>
        {listOfAnswers}
        <div>
          {this.props.problem.explanation}
        </div>
      </div>
    );
  }


});

export { Problem };