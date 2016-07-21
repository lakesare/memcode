import React from 'react';
import { connect } from 'react-redux';

let Show = React.createClass({

  propTypes: {
    answer: React.PropTypes.object.isRequired
    // index, problemId
  },


  checkAnswer() {
    const inputedAnswer = this.refs.hi.value;

    if (inputedAnswer == this.props.answer.answer) {
      this.props.answerRight(this.props.id);
    }
  },


  render() {
    console.log(this.props.answer.answered);
    return(
      <input
        ref='hi'
        type='text'
        readOnly={this.props.answer.answered == 'right' ? true : false}
        onChange={this.checkAnswer}
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


