import React from 'react';

class InputForAnswer extends React.Component {
  static propTypes = {
    answer: React.PropTypes.string.isRequired,
    ifFirst: React.PropTypes.bool.isRequired,
    onRightAnswerGiven: React.PropTypes.func.isRequired,
    status: React.PropTypes.oneOf(['solving', 'seeingAnswer']).isRequired
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
    switch (this.props.status) {
      case 'solving': return (
        <input
          className={'answer ' + (this.state.isAnswered ? 'success' : 'waiting')}
          type="text"
          readOnly={this.state.isAnswered}
          onChange={this.onChange}
          value={this.state.currentGuess}
          autoFocus={this.props.ifFirst}
        />
      );
      case 'seeingAnswer':  return (
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
  status: state.pages.Page_courses_id_review.statusOfSolving.status
});
const mapDispatchToProps = (dispatch) => ({
  onRightAnswerGiven: () => dispatch({ type: 'INLINED_ANSWER_GIVEN' })
});

import { connect } from 'react-redux';
InputForAnswer = connect(mapStateToProps, mapDispatchToProps)(InputForAnswer);

export { InputForAnswer };
