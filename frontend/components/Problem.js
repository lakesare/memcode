import React from 'react';

import { convertToRaw, DefaultDraftBlockRenderMap } from 'draft-js';

import Immutable from 'immutable';

// draftJs
import { DraftJsPlugins } from '~/services/draftJs/plugins';
import { DraftJsDecorators } from '~/services/draftJs/decorators';

import Editor from 'draft-js-plugins-editor';

class Problem extends React.Component {
  static propTypes = {
    mode: React.PropTypes.oneOf(['editing', 'solving', 'succumbedAfterSolving']).isRequired,
    saveFn: React.PropTypes.func,
    destroyFn: React.PropTypes.func,
    onRightAnswerGivenFn: React.PropTypes.func,

    initialContentEditorState: React.PropTypes.object.isRequired,
    initialExplanationEditorState: React.PropTypes.object.isRequired,
  }

  static defaultProps = {
    saveFn: null,
    destroyFn: null,
    onRightAnswerGivenFn: null
  }

  constructor(props) {
    super(props);

    this.state = {
      contentEditorState: this.props.initialContentEditorState,
      explanationEditorState: this.props.initialExplanationEditorState,
    };

    this.references = {
      contentEditor: null
    };
  }

  blockRenderMap = () =>
    DefaultDraftBlockRenderMap.merge(
      Immutable.Map({
        'code-block': {
          element: 'code', // or
        }
      })
    );

  save = () => {
    this.props.saveFn(
      convertToRaw(this.state.    contentEditorState.getCurrentContent()),
      convertToRaw(this.state.explanationEditorState.getCurrentContent())
    )
      .then((nextState) => {
        this.references.contentEditor.focus();
        if (nextState) this.setState(nextState);
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
          decorators={
            ( // only initialized on mount
              () => {
                switch (this.props.mode) {
                  case 'editing':
                    return [DraftJsDecorators.editableAnswer()];
                  case 'solving':
                    return [DraftJsDecorators.solvableAnswer(this.props.onRightAnswerGivenFn)];
                }
              }
            )()
          }
          ref={ref => { this.references.contentEditor = ref; }}
          blockRenderMap={this.blockRenderMap()}
          readOnly={this.props.mode === 'solving' || this.props.mode === 'succumbedAfterSolving'}
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
          readOnly={this.props.mode === 'solving' || this.props.mode === 'succumbedAfterSolving'}
        />
      </div>

      {
        this.props.mode === 'editing' &&
        this.props.destroyFn &&
        <div className="actions">
          <i className="fa fa-trash-o" onClick={this.props.destroyFn}/>
        </div>
      }
    </section>
}

export { Problem };
