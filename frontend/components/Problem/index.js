import React from 'react';

import { ProblemWithInlinedAnswers } from './components/ProblemWithInlinedAnswers';
import { ProblemWithSeparateAnswer } from './components/ProblemWithSeparateAnswer';

import css from './index.css';

class Problem extends React.Component {
  static propTypes = {
    mode: React.PropTypes.oneOf([
      'viewing', 'editingOld', 'editingNew', 'solving', 'succumbed'
    ]).isRequired,
    problemType: React.PropTypes.string.isRequired,

    problemContent: React.PropTypes.object,
    saveFn: React.PropTypes.func, // when 'editing'
    onRightAnswerGivenFn: React.PropTypes.func, // when 'solving'
  }

  renderProblem = (type) => {
    switch (type) {
    case 'inlinedAnswers':
      return <ProblemWithInlinedAnswers
        problemContent={this.props.problemContent}
        mode={this.props.mode}
        saveFn={this.props.saveFn}
        onRightAnswerGivenFn={this.props.onRightAnswerGivenFn}
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
