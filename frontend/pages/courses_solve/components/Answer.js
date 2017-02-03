import React from 'react';

class Answer extends React.Component {
  static propTypes = {
    answer: React.PropTypes.object.isRequired,
    answerIndex: React.PropTypes.number.isRequired,
    answerRight: React.PropTypes.func.isRequired
  }

  checkAnswer = () => {
    const inputedAnswer = this.refs.input.value;
    if (inputedAnswer === this.props.answer.answer) {
      this.props.answerRight(this.props.answerIndex);
    }
  }

  // TODO use value instead with onChange updates
  d = () => {
    if (this.props.answer.answered) {
      return this.props.answer.answer;
    } else { return ''; }
  }

  render = () =>
    <input
      className={'answer ' + (this.props.answer.answered === 'right' ? 'success' : 'failure')}
      ref="input"
      type="text"
      readOnly={this.props.answer.answered === 'right'}
      onChange={this.checkAnswer}
      defaultValue={this.d()}
    />
}

export { Answer };
