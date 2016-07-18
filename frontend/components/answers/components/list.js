import React from 'react';
import { Show } from './show';


const List = React.createClass({

  propTypes: {
    answers: React.PropTypes.array.isRequired
  },

  render() {
    const aa = [];
    this.props.answers.forEach((answer) => {
      
      aa.push(answer.precedingText);
      aa.push(<Show
        key={answer.id}
        answer={answer}
      />)

    });
    return(
      <div>
        {aa}
      </div>
    );
  }


});

export { List };