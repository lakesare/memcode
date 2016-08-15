import React from 'react';
import { AnswersShow } from '../../answers'
import css from './show.scss';
import { MarkdownStringToHtmlString, HtmlStringToComponent } from '../../../services/markdownToJsx';
import ReactDOM from 'react-dom';

// temporary hack for CDNed Babel
window.React = React;
window.AnswersShow = AnswersShow;

const Show = React.createClass({
  propTypes: {
    problem: React.PropTypes.object.isRequired,
    index:   React.PropTypes.number.isRequired
  },

  answers() {
    return this.props.problem.content.answers
  },
  text() {
    return this.props.problem.content.text
  },

  renderContent() {
    let aa = []
    let answerIndex = 0
    this.text().forEach((textPart) => {
      if (textPart === null) {
        aa.push(`<AnswersShow 
          key={` + answerIndex + `}
          answer={` + JSON.stringify(this.answers()[answerIndex]) + `} 
          answerIndex={` + answerIndex + `} 
          problemId={` + this.props.problem.id + `}
        />`);
        answerIndex ++;
      } else {
        aa.push(textPart)
      }
    });



    return HtmlStringToComponent(aa.join(' '))




  },


  render() {
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