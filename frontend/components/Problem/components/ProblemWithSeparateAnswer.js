import React from 'react';

import { CommonEditor } from './CommonEditor';

import { toApi, fromApi } from '../services';


// user sees the question,
// types in answer in the decorative lower editor on the right,
// then clicks to check the answer
// then answer rating is given
// then 'NEXT'

// separateAnswer:
//   look at the problem, think of an answer
//   click on the answer
//   give self rating
class ProblemWithSeparateAnswer extends React.Component {
  static propTypes = {
    mode: React.PropTypes.string.isRequired,
    problemContent: React.PropTypes.object, // always except for when 'editing' new

    statusOfSolving: React.PropTypes.oneOf([
      'solving', 'seeingAnswer'
    ]), // when 'solving'
    enterPressed: React.PropTypes.func,

    saveFn: React.PropTypes.func // when 'editing'
  }

  static defaultProps = {
    problemContent: { content: null, answer: null }
  }

  constructor(props) {
    super(props);

    this.state = {
      contentEditorState: fromApi(this.props.problemContent.content),
      answerEditorState: fromApi(this.props.problemContent.answer),
      answerDraftEditorState: fromApi(null)
    };
  }

  save = () =>
    this.props.saveFn({
      content: toApi(this.state.contentEditorState),
      answer: toApi(this.state.answerEditorState)
    })

  renderAnswer = () => {
    if (
      this.props.mode === 'solving' &&
      this.props.statusOfSolving === 'solving'
    ) {
      return <div
        className="see-answer"
        onClick={this.props.enterPressed}
      >See answer</div>;
    } else {
      return <div className="answer">
        <CommonEditor
          mode={this.props.mode}
          editorState={this.state.answerEditorState}
          onChange={newState => this.setState({ answerEditorState: newState })}
          save={this.save}
          placeholder={<div>Enter an answer</div>}
        />
      </div>;
    }
  }

  render = () =>
    <section className="problem -withSeparateAnswer">
      <div className="content first-column">
        <CommonEditor
          mode={this.props.mode}
          editorState={this.state.contentEditorState}
          onChange={newState => this.setState({ contentEditorState: newState })}
          save={this.save}
          placeholder={<div>Enter a question</div>}
        />
      </div>

      <div className="second-column">
        {this.renderAnswer()}

        { // when 'solving' always have draft answer editor available
          this.props.mode === 'solving' &&
          <div className="draft-answer">
            <CommonEditor
              mode="editing"
              editorState={this.state.answerDraftEditorState}
              onChange={newState => this.setState({ answerDraftEditorState: newState })}
              placeholder={<div>You can draft your answer here</div>}
            />
          </div>
        }
      </div>
    </section>
}

const mapStateToProps = (state, ownProps) => {
  if (ownProps.mode === 'solving') {
    const pageState = state.pages.Page_courses_id_review;
    return {
      statusOfSolving: pageState.statusOfSolving.status
    };
  } else {
    return {};
  }
};
import { Page_courses_id_review_Actions } from '~/pages/courses_id_review/reducer';
const { enterPressed } = Page_courses_id_review_Actions;
const mapDispatchToProps = (dispatch) => ({
  enterPressed: () => dispatch(enterPressed())
});

import { connect } from 'react-redux';
ProblemWithSeparateAnswer = connect(mapStateToProps, mapDispatchToProps)(ProblemWithSeparateAnswer);

export { ProblemWithSeparateAnswer };
