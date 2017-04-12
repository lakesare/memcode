import React from 'react';

import { CommonEditor } from './CommonEditor';

import { toApi, fromApi } from '../services';


// user sees the question,
// types in answer in the decorative lower editor on the right,
// then clicks to check the answer
// then answer rating is given
// then 'NEXT'
class ProblemWithSeparateAnswer extends React.Component {
  static propTypes = {
    mode: React.PropTypes.string.isRequired,
    problemContent: React.PropTypes.object, // always except for when 'editing' new

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

      <div className="answer second-column">
        <CommonEditor
          mode={this.props.mode}
          editorState={this.state.answerEditorState}
          onChange={newState => this.setState({ answerEditorState: newState })}
          save={this.save}
          placeholder={<div>Enter an answer</div>}
        />

        {
          this.props.mode === 'solving' &&
          <CommonEditor
            mode={this.props.mode}
            editorState={this.state.answerDraftEditorState}
            onChange={newState => this.setState({ answerDraftEditorState: newState })}
            placeholder={<div>You can draft you answer here</div>}
          />
        }
      </div>
    </section>
}

export { ProblemWithSeparateAnswer };
