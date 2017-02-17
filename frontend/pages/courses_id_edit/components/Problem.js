import React from 'react';

import { contentObjectToString } from '~/services/contentObjectToString';
import { contentStringToJsx } from '~/services/contentStringToJsx';



class Problem extends React.Component {
  static propTypes = {
    problem: React.PropTypes.object.isRequired,
    index:   React.PropTypes.number.isRequired, // just for pretiness, to number down the problems
  }

  renderContent = () => {
    const content = this.props.problem.content;
    const jsx = contentStringToJsx(
      contentObjectToString(content.text),
      answerIndex => <input className="answer success" type="text" readOnly value={content.answers[answerIndex]}/>
    );
    return jsx;
  }

  makeExplanationEditable = (event) => {
    console.log(event.target.innerText)
  }

  render = () =>
    <section className="problem row">
      <div className="index">{this.props.index}</div>

      <div className="content col-6">
        {this.renderContent()}
      </div>

      <div
        className="explanation col-6"
        dangerouslySetInnerHTML={{ __html: this.props.problem.explanation }}
        onClick={this.makeExplanationEditable}
      />

      <div className="actions">
        <i className="fa fa-trash-o"/>
      </div>
    </section>
}

export { Problem };


// import { problemContentToTextarea } from '~/services/problemContentToTextarea';

// problems: problems.map(problem => ({ ...problem, content: problemContentToTextarea(problem.content) }))


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
