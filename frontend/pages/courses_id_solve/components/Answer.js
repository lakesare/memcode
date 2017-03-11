import React from 'react';

class Answer extends React.Component {
  static propTypes = {
    answer: React.PropTypes.string.isRequired,
    onRightAnswerGiven: React.PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      isAnswered: false
    };
  }

  checkAnswer = () => {
    const inputedAnswer = this.refs.input.value;
    if (inputedAnswer === this.props.answer) {
      this.setState({ isAnswered: true });
      this.props.onRightAnswerGiven();
    }
  }

  // TODO use value instead with onChange updates
  d = () => {
    if (this.props.answer.isAnswered) {
      return this.props.answer.answer;
    } else { return ''; }
  }

  render = () =>
    <input
      className={'answer ' + (this.state.isAnswered ? 'success' : 'failure')}
      ref="input"
      type="text"
      readOnly={this.state.isAnswered}
      onChange={this.checkAnswer}
      defaultValue={this.d()}
    />
}

export { Answer };
