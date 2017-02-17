import React from 'react';

import { Answer } from './Answer';

import { contentObjectToString } from '~/services/contentObjectToString';
import { contentStringToJsx } from '~/services/contentStringToJsx';

class Problem extends React.Component {
  static propTypes = {
    problem: React.PropTypes.object.isRequired,
    index:   React.PropTypes.number.isRequired, // just for pretiness, to number down the problems
    onRightAnswerGiven: React.PropTypes.func.isRequired
  }

  onRightAnswerGiven = (answerIndex) => {
    this.props.onRightAnswerGiven(this.props.problem.id, answerIndex);
  }

  renderContent = () => {
    const content = this.props.problem.content;
    const jsx = contentStringToJsx(
      contentObjectToString(content.text),
      answerIndex =>
        <Answer
          key={answerIndex + 10000} // temp fix, there is some bug with keying some texts in html-to-react. it disappears if we get rid of either <answer> or all the other tag parsing.
          answer={content.answers[answerIndex]}
          onRightAnswerGiven={() => this.props.onRightAnswerGiven(answerIndex)}
        />
    );
    return jsx;
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
      />
    </section>
}

export { Problem };
