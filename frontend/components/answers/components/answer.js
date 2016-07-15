import React from 'react';


const Answer = React.createClass({

  checkAnswer() {
    const inputedAnswer = this.refs.hi.value;
    console.log(inputedAnswer);

    if (inputedAnswer == this.props.answer.answer) {
      this.props.store.dispatch({
        type: 'MARK_ANSWER_AS_SUCCESSFUL', 
        id: this.props.id
      });
    }
  },


  render() {
    console.log('answer rendered');
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

export { Answer };


