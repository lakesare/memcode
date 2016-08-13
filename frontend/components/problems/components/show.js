import React from 'react';
import { AnswersShow } from '../../answers'
import css from './show.scss';


import marky from 'marky-markdown';




const Show = React.createClass({
  propTypes: {
    problem: React.PropTypes.object.isRequired,
    index:   React.PropTypes.number.isRequired
  },

  renderContent() {
    const content = this.props.problem.content;
    let aa = []
    let answerIndex = 0
    content.text.forEach((textPart) => {
      if (textPart === null) {
        aa.push(<AnswersShow 
          key={answerIndex}
          answer={content.answers[answerIndex]} 
          answerIndex={answerIndex} 
          problemId={this.props.problem.id}
        />);
        answerIndex ++;
      } else {

        const htmlizedText = <span dangerouslySetInnerHTML={ 
          { __html: marky(textPart).html() } 
        }></span>;
        aa.push(htmlizedText);
      }
    });
    return aa
  },

  render() {
    console.log('problem rendered');

    return(
      <div className={css.problem + ' row'}>
        <div className="columns small-1">{this.props.index + 1}</div>

        <div className="columns small-7">
          {this.renderContent()}
        </div>


        <div className={css.context + " columns small-4"}>
          {this.props.problem.explanation}
        </div>
      </div>
    );
  }
});



export { Show };