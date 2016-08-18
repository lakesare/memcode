import React from 'react';
import { connect } from 'react-redux';
import css from './show.scss';

let Show = React.createClass({
  propTypes: {
    answer: React.PropTypes.object.isRequired,
    answerIndex: React.PropTypes.number.isRequired,
    problemId: React.PropTypes.number.isRequired
  },

  checkAnswer() {
    const inputedAnswer = this.refs.input.value;
    if (inputedAnswer == this.props.answer.answer) {
      this.props.answerRight(this.props.id);
    }
  },

  // TODO use value instead with onChange updates
  d() {
    if (this.props.answer.answered) {
      return this.props.answer.answer
    } else { return '' }
  },

  render() {
    return(
      <input
        className={css.input + ' ' + (this.props.answer.answered == 'right' ? css.success : css.failure)}
        ref='input'
        type='text'
        readOnly={this.props.answer.answered == 'right' ? true : false}
        onChange={this.checkAnswer}
        defaultValue={ this.d() } 
      />
    );
  }
});

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    answerRight: (id) => {
      dispatch({
        type: 'MARK_ANSWER_AS_RIGHT', 
        problemId: ownProps.problemId,
        answerIndex:  ownProps.answerIndex
      });
    },
  }
}

Show = connect(
  ()=>({}),
  mapDispatchToProps
)(Show);

export { Show };