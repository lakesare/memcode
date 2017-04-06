import React from 'react';

import { convertToRaw } from 'draft-js';
import Editor from 'draft-js-plugins-editor';

// draftJs
import { DraftJsPlugins } from '~/services/draftJs/plugins';
import { DraftJsDecorators } from '~/services/draftJs/decorators';
import { blockRenderMap } from '~/services/draftJs/blockRenderMap';
import { createEditorState } from '~/services/draftJs/createEditorState';

import css from './index.css';

class Problem extends React.Component {
  static propTypes = {
    mode: React.PropTypes.oneOf(['viewing', 'editing', 'solving', 'succumbed']).isRequired,
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
      contentEditorState: createEditorState(this.props.initialContentEditorState),
      explanationEditorState: createEditorState(this.props.initialExplanationEditorState),
    };
  }

  onBlur = () => {
    const isNewProblem = this.props.initialContentEditorState === null;
    if (!isNewProblem) {
      this.save();
    }
  }

  save = () =>
    this.props.saveFn(
      convertToRaw(this.state.    contentEditorState.getCurrentContent()),
      convertToRaw(this.state.explanationEditorState.getCurrentContent())
    )

  isReadonly = (mode) =>
    mode === 'solving' ||
    mode === 'succumbed' ||
    mode === 'viewing'

  render = () =>
    <section className={`problem ${css.problem}`}>
      <div className="content">
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
          blockRenderMap={blockRenderMap()}
          readOnly={this.isReadonly(this.props.mode)}
        />
      </div>

      <div className="explanation">
        <Editor
          editorState={this.state.explanationEditorState}
          onChange={newState => this.setState({ explanationEditorState: newState })}
          onBlur={this.onBlur}
          plugins={[
            DraftJsPlugins.saveProblem(this.save),
            DraftJsPlugins.richText(),
            DraftJsPlugins.pasteImageFromClipboard()
          ]}
          blockRenderMap={blockRenderMap()}
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
