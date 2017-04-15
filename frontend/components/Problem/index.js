import React from 'react';

import { ProblemWithInlinedAnswers } from './components/ProblemWithInlinedAnswers';
import { ProblemWithSeparateAnswer } from './components/ProblemWithSeparateAnswer';

import css from './index.css';

class Problem extends React.Component {
  static propTypes = {
    mode: React.PropTypes.oneOf([
      'viewing', 'solving', 'editingOld', 'editingNew'
    ]).isRequired,
    problemType: React.PropTypes.string.isRequired,

    problemContent: React.PropTypes.object,
    saveFn: React.PropTypes.func, // when 'editing'
  }

  renderProblem = (type) => {
    switch (type) {
      case 'inlinedAnswers':
        return <ProblemWithInlinedAnswers
          problemContent={this.props.problemContent}
          mode={this.props.mode}
          saveFn={this.props.saveFn}
        />;
      case 'separateAnswer':
        return <ProblemWithSeparateAnswer
          problemContent={this.props.problemContent}
          mode={this.props.mode}
          saveFn={this.props.saveFn}
        />;
      default:
        throw new Error(`Problem type '${type}' doesn't exist.`);
    }
  }

  render = () =>
    <div className={css['problem-wrapper']}>
      {this.renderProblem(this.props.problemType)}
    </div>
}

export { Problem };
