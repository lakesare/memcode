import React from 'react';
import { connect } from 'react-redux';

let Show = React.createClass({

  propTypes: {
    answer: React.PropTypes.object.isRequired
  },


  checkAnswer() {
    const inputedAnswer = this.refs.hi.value;

    if (inputedAnswer == this.props.answer.answer) {
      this.props.answerRight(this.props.answer.id);
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


const mapDispatchToProps = (dispatch) => {
  return {
    answerRight: (id) => {
      dispatch({
        type: 'MARK_ANSWER_AS_RIGHT', 
        id: id
      });
    },
  }
}


Show = connect(
  ()=>({}),
  mapDispatchToProps
)(Show);

export { Show };


