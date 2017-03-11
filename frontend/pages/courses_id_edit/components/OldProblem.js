import React from 'react';

import Editor from 'draft-js-plugins-editor';
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';

// draftJs
import { DraftJsPlugins } from '~/services/draftJs/plugins';
import { DraftJsDecorators } from '~/services/draftJs/decorators';

import * as ProblemApi from '~/api/Problem';

class OldProblem extends React.Component {
  static propTypes = {
    problem: React.PropTypes.object.isRequired,
    updateOldProblem: React.PropTypes.func.isRequired,
    removeOldProblem: React.PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);

    this.state = {
      contentEditorState: this.createEditorState(this.props.problem.content),
      explanationEditorState: this.createEditorState(this.props.problem.explanation),

      speUpdateProblem: {},
      speDestroyProblem: {}
    };
  }

  createEditorState = (raw) =>
    EditorState.createWithContent(convertFromRaw(raw));

  apiSave = () => {
    ProblemApi.update(
      (spe) => this.setState({ speUpdateProblem: spe }),
      this.props.problem.id,
      {
        content: convertToRaw(this.state.contentEditorState.getCurrentContent()),
        explanation: convertToRaw(this.state.explanationEditorState.getCurrentContent()),
      }
    )
      .then((updatedProblem) => {
        this.props.updateOldProblem(updatedProblem);
      });
  }

  apiDestroy = () => {
    ProblemApi.destroy(
      (spe) => this.setState({ speDestroyProblem: spe }),
      this.props.problem.id
    )
      .then(() => {
        this.props.removeOldProblem(this.props.problem.id);
      });
  }

  render = () =>
    <section className="problem row">
      <div className="content col-6">
        <Editor
          editorState={this.state.contentEditorState}
          onChange={newState => this.setState({ contentEditorState: newState })}
          plugins={[
            DraftJsPlugins.saveProblem(this.apiSave),
            DraftJsPlugins.richText(),
            DraftJsPlugins.pasteImageFromClipboard(),
            DraftJsPlugins.answerInput()
          ]}
          decorators={[DraftJsDecorators.editableAnswer()]}
        />
      </div>

      <div className="explanation col-6">
        <Editor
          editorState={this.state.explanationEditorState}
          onChange={newState => this.setState({ explanationEditorState: newState })}
          plugins={[
            DraftJsPlugins.saveProblem(this.apiSave),
            DraftJsPlugins.richText(),
            DraftJsPlugins.pasteImageFromClipboard()
          ]}
        />
      </div>

      <div className="actions">
        <i className="fa fa-trash-o" onClick={this.apiDestroy}/>
      </div>
    </section>
}

export { OldProblem };
