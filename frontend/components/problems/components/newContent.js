import React from 'react';
import { surroundSelectionWithString } from '../../../services/surroundSelectionWithString';

const newContent = React.createClass({
  checkIfShortcutForAnswerTag(event) {
    if(event.ctrlKey && event.keyCode == 16){
      surroundSelectionWithString(event.target, '<answer>', '</answer>');
    }
  },

  render() {
    const { input } = this.props
    return (
      <div>
        <p>Press CTRL+SHIFT to input an answer.</p>
        <textarea {...input} onKeyUp={this.checkIfShortcutForAnswerTag}></textarea>
      </div>
    )
  }

});

export { newContent };