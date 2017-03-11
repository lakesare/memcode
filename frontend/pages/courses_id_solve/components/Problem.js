
import React from 'react';


import Editor from 'draft-js-plugins-editor';
import { EditorState, convertFromRaw } from 'draft-js';

// draftJs
import { DraftJsPlugins } from '~/services/draftJs/plugins';
import { DraftJsDecorators } from '~/services/draftJs/decorators';


class Problem extends React.Component {
  static propTypes = {
    problem: React.PropTypes.object.isRequired,
    onRightAnswerGiven: React.PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);

    this.state = {
      contentEditorState: this.createEditorState(this.props.problem.content),
      explanationEditorState: this.createEditorState(this.props.problem.explanation),

      speUpdateProblem: {}
    };
  }

  createEditorState = (raw) =>
    EditorState.createWithContent(convertFromRaw(raw));

  render = () =>
    <section className="problem row">
      <div className="content col-6">
        <Editor
          editorState={this.state.contentEditorState}
          onChange={newState => this.setState({ contentEditorState: newState })}
          plugins={[
            DraftJsPlugins.richText(),
            DraftJsPlugins.pasteImageFromClipboard(),
            DraftJsPlugins.answerInput()
          ]}
          decorators={[
            DraftJsDecorators.solvableAnswer(this.props.onRightAnswerGiven)
          ]}
          readOnly
        />
      </div>

      <div className="explanation col-6">
        <Editor
          editorState={this.state.explanationEditorState}
          onChange={newState => this.setState({ explanationEditorState: newState })}
          plugins={[
            DraftJsPlugins.richText(),
            DraftJsPlugins.pasteImageFromClipboard()
          ]}
          readOnly
        />
      </div>
    </section>
}

export { Problem };
