import React from 'react';

class InputForAnswer extends React.Component {
  static propTypes = {
    answer: React.PropTypes.string.isRequired,
    onRightAnswerGiven: React.PropTypes.func,
    statusOfSolvingCurrentProblem: React.PropTypes.oneOf(['solving', 'succumbedAfterSolving']).isRequired
  }

  static defaultProps = {
    onRightAnswerGiven: null
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
      this.props.onRightAnswerGiven();
    }
  }

  render = () => {
    console.log(this.props.answer + ': ' + this.state.isAnswered);
    switch (this.props.statusOfSolvingCurrentProblem) {
      case 'solving': return (
        <input
          className={'answer ' + (this.state.isAnswered ? 'success' : 'waiting')}
          type="text"
          readOnly={this.state.isAnswered}
          onChange={this.onChange}
          value={this.state.currentGuess}
        />
      );
      case 'succumbedAfterSolving':  return (
        <input
          className={'answer ' + (this.state.isAnswered ? 'success' : 'failure')}
          type="text"
          readOnly
          value={this.props.answer}
        />
      );
    }
  }
}

const mapStateToProps = (state) => ({
  statusOfSolvingCurrentProblem: state.page_courses_id_review.statusOfSolvingCurrentProblem
});

import { connect } from 'react-redux';
InputForAnswer = connect(mapStateToProps, () => ({}))(InputForAnswer);

export { InputForAnswer };
