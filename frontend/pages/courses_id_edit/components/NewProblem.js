import React from 'react';

import Editor from 'draft-js-plugins-editor';
import { EditorState, convertToRaw } from 'draft-js';

// draftJs
import { DraftJsPlugins } from '~/services/draftJs/plugins';
import { DraftJsDecorators } from '~/services/draftJs/decorators';

import * as ProblemApi from '~/api/Problem';

class NewProblem extends React.Component {
  static propTypes = {
    courseId: React.PropTypes.string.isRequired,
    addNewProblem: React.PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.state = this.initialState();
    this.references = {
      contentEditor: null
    };
  }

  initialState = () => ({
    contentEditorState: EditorState.createEmpty(),
    explanationEditorState: EditorState.createEmpty(),

    speCreateProblem: {}
  })

  save = () => {
    ProblemApi.create(
      (spe) => this.setState({ speCreateProblem: spe }),
      {
        content: convertToRaw(this.state.contentEditorState.getCurrentContent()),
        explanation: convertToRaw(this.state.explanationEditorState.getCurrentContent()),
        courseId: this.props.courseId
      }
    )
      .then((createdProblem) => {
        this.props.addNewProblem(createdProblem);
        this.references.contentEditor.focus();
        this.setState(this.initialState());
      });
  }

  render = () =>
    <section className="problem row">
      <div className="content col-6">
        <Editor
          editorState={this.state.contentEditorState}
          onChange={newState => this.setState({ contentEditorState: newState })}
          plugins={[
            DraftJsPlugins.saveProblem(this.save),
            DraftJsPlugins.richText(),
            DraftJsPlugins.pasteImageFromClipboard(),
            DraftJsPlugins.answerInput()
          ]}
          decorators={[DraftJsDecorators.editableAnswer()]}
          ref={ref => { this.references.contentEditor = ref; }}
        />
      </div>

      <div className="explanation col-6">
        <Editor
          editorState={this.state.explanationEditorState}
          onChange={newState => this.setState({ explanationEditorState: newState })}
          plugins={[
            DraftJsPlugins.saveProblem(this.save),
            DraftJsPlugins.richText(),
            DraftJsPlugins.pasteImageFromClipboard()
          ]}
        />
      </div>
    </section>
}

export { NewProblem };

