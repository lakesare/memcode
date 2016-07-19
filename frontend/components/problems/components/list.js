import React from 'react';
import { Show } from './show';

const List = React.createClass({

  propTypes: {
    problems: React.PropTypes.object.isRequired,
    answers: React.PropTypes.arrayOf(React.PropTypes.object).isRequired
  },

  componentDidMount() {
    this.props.fetchProblems(1);
  },

  render() {
    const aa = this.props.problems.items.map((problem) => {
      let answers = problem.answerIds.map((answerId) => {
        return this.props.answers.find((answer) => {
          return answer.id === answerId
        });
      });
      return <Show key={problem.id} problem={problem} answers={answers}/>
    });


    return(
      <div>
        {aa}
      </div>
    );
  }


});

export { List };







