import React from 'react';

import {
  EditorState,
  convertToRaw, convertFromRaw,
  DefaultDraftBlockRenderMap
} from 'draft-js';

import Immutable from 'immutable';

// draftJs
import { DraftJsPlugins } from '~/services/draftJs/plugins';
import { DraftJsDecorators } from '~/services/draftJs/decorators';

import Editor from 'draft-js-plugins-editor';

class Hi extends React.Component {
  render = () =>
    <pre><code>{this.props.children}</code></pre>
}

class Problem extends React.Component {
  static propTypes = {
    mode: React.PropTypes.oneOf(['viewing', 'editing', 'solving', 'succumbedAfterSolving']).isRequired,
    saveFn:               React.PropTypes.func,
    destroyFn:            React.PropTypes.func,
    onRightAnswerGivenFn: React.PropTypes.func,

    initialContentEditorState:     React.PropTypes.object,
    initialExplanationEditorState: React.PropTypes.object,
  }

  static defaultProps = {
    saveFn: null,
    destroyFn: null,
    onRightAnswerGivenFn: null,
    initialContentEditorState: null,
    initialExplanationEditorState: null
  }

  constructor(props) {
    super(props);

    this.state = {
      contentEditorState: this.createEditorState(this.props.initialContentEditorState),
      explanationEditorState: this.createEditorState(this.props.initialExplanationEditorState),
    };

    this.references = {
      contentEditor: null
    };
  }

  createEditorState = (raw) => {
    if (raw) {
      return EditorState.createWithContent(convertFromRaw(raw));
    } else {
      return EditorState.createEmpty();
    }
  }

  blockRenderMap = () =>
    DefaultDraftBlockRenderMap.merge(
      Immutable.Map({
        'code-block': {
          wrapper: <Hi/>
        }
      })
    );

  save = () =>
    this.props.saveFn(
      convertToRaw(this.state.    contentEditorState.getCurrentContent()),
      convertToRaw(this.state.explanationEditorState.getCurrentContent())
    )

  onBlur = () => {
    const isNewProblem = this.props.initialContentEditorState === null;
    if (!isNewProblem) {
      this.save();
    }
  }

  isReadonly = (mode) =>
    mode === 'solving' ||
    mode === 'succumbedAfterSolving' ||
    mode === 'viewing'

  render = () =>
    <section className="problem row">
      <div className="content col-6">
        <Editor
          editorState={this.state.contentEditorState}
          onChange={newState => this.setState({ contentEditorState: newState })}
          onBlur={this.onBlur}
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
                  case 'viewing':
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
          readOnly={this.isReadonly(this.props.mode)}
        />
      </div>

      <div className="explanation col-6">
        <Editor
          editorState={this.state.explanationEditorState}
          onChange={newState => this.setState({ explanationEditorState: newState })}
          onBlur={this.onBlur}
          plugins={[
            DraftJsPlugins.saveProblem(this.save),
            DraftJsPlugins.richText(),
            DraftJsPlugins.pasteImageFromClipboard()
          ]}
          readOnly={this.isReadonly(this.props.mode)}
        />
      </div>

      {
        this.props.mode === 'editing' &&
        this.props.destroyFn &&
        <a className="remove" onClick={this.props.destroyFn}>
          <i className="fa fa-trash-o"/>
        </a>
      }
    </section>
}

export { Problem };
