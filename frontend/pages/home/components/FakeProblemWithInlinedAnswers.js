import React from 'react';

class Answer extends React.Component {
  static propTypes = {
    answer: React.PropTypes.string.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      isAnswered: false,
      currentGuess: ''
    };
  }

  onChange = (event) => {
    const newGuess = event.target.value;
    this.setState({ currentGuess: newGuess });
    this.checkAnswer(newGuess);
  }

  checkAnswer = (inputedAnswer) => {
    if (inputedAnswer === this.props.answer) {
      this.setState({ isAnswered: true });
    }
  }

  render = () =>
    <input
      className={'answer ' + (this.state.isAnswered ? 'success' : 'waiting')}
      type="text"
      readOnly={this.state.isAnswered}
      onChange={this.onChange}
      value={this.state.currentGuess}
    />
}

const FakeProblemWithInlinedAnswers = () =>
  <section className="problem -withInlinedAnswers">
    <div className="first-column">
      Operation is <Answer answer="idempotent"/> if it can be applied multiple times without changing the result after the initial application.
    </div>

    <div className="second-column">
      (Try typing in <b>'idempotent'</b>)
    </div>
  </section>;

export { FakeProblemWithInlinedAnswers };
