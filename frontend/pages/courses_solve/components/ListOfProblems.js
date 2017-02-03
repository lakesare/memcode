import React from 'react';

import { Problem } from './Problem';

class ListOfProblems extends React.Component {
  static propTypes = {
    problems: React.PropTypes.array.isRequired,
    onRightAnswerGiven: React.PropTypes.func.isRequired
  }

  render = () => {
    const listOfProblems = this.props.problems.map((problem, index) =>
      <Problem
        key={problem.id}
        problem={problem}
        index={index + 1}
        onRightAnswerGiven={this.props.onRightAnswerGiven}
      />,
    );

    return (
      <div>
        {listOfProblems}
      </div>
    );
  }
}

export { ListOfProblems };
