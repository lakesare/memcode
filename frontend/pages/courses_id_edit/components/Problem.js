import React from 'react';

import { contentObjectToString } from '~/services/contentObjectToString';
import { contentStringToJsx } from '~/services/contentStringToJsx';

import {
  Editor, EditorState, convertFromHTML, ContentState,
  RichUtils, getDefaultKeyBinding
} from 'draft-js';



class Problem extends React.Component {
  static propTypes = {
    problem: React.PropTypes.object.isRequired,
    index:   React.PropTypes.number.isRequired, // just for pretiness, to number down the problems
  }

  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createWithContent(
        ContentState.createFromBlockArray(
          convertFromHTML(this.props.problem.explanation || '')
        )
      )
    };
  }

  renderContent = () => {
    const content = this.props.problem.content;
    const jsx = contentStringToJsx(
      contentObjectToString(content.text),
      answerIndex => <input className="answer success" type="text" readOnly value={content.answers[answerIndex]}/>
    );
    return jsx;
  }

  myKeyBindingFn = (e) => {
    console.log(e.keyCode);
    if (e.keyCode === 17) {
      return 'BOLD';
    }
    return getDefaultKeyBinding(e);
  }

  handleKeyCommand = (command) => {
    let newState;
    if (command === 'BOLD') {
      newState = RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD');
    }

    if (newState) {
      this.setState({ editorState: newState });
      return 'handled';
    }
    return 'not-handled';
  }


  render = () =>
    <section className="problem row">
      <div className="index">{this.props.index}</div>

      <div className="content col-6">
        {this.renderContent()}
      </div>

      <Editor
        editorState={this.state.editorState}
        onChange={(newState) => this.setState({ editorState: newState })}
        handleKeyCommand={this.handleKeyCommand}
        keyBindingFn={this.myKeyBindingFn}
      />

      <div className="actions">
        <i className="fa fa-trash-o"/>
      </div>
    </section>
}

export { Problem };


// import { problemContentToTextarea } from '~/services/problemContentToTextarea';

// // problems: problems.map(problem => ({ ...problem, content: problemContentToTextarea(problem.content) }))


// import React from 'react';
// import { surroundSelectionWithString } from '../../../services/surroundSelectionWithString';

// const newContent = React.createClass({
//   checkIfShortcutForAnswerTag(event) {
//     if(event.ctrlKey && event.keyCode == 16){
//       surroundSelectionWithString(event.target, '<answer>', '</answer>');
//     }
//   },

//   render() {
//     const { input } = this.props
//     return (
//       <div>
//         <p>Press CTRL+SHIFT to input an answer.</p>
//         <textarea {...input} onKeyUp={this.checkIfShortcutForAnswerTag}></textarea>
//       </div>
//     )
//   }

// });

// export { newContent };
