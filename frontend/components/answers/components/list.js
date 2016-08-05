import React from 'react';
import { Show } from './show';


const List = React.createClass({

  propTypes: {
    answers: React.PropTypes.array.isRequired
  },

  render() {
    const aa = [];

    this.props.answers.forEach((answer, index) => {
      
      aa.push(answer.precedingText);
      aa.push(<Show
        key={index}
        answer={answer}
        answerIndex={index}
        problemId={this.props.problemId}
      />)

    });
    return(
      <div className="columns small-7">
        {aa}
      </div>
    );
  }


});

export { List };