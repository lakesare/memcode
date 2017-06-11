import Editor from 'draft-js-plugins-editor';

// draftJs
import { DraftJsPlugins } from '~/services/draftJs/plugins';
import { DraftJsDecorators } from '~/services/draftJs/decorators';
import { blockRenderMap } from '~/services/draftJs/blockRenderMap';
import { customStyleMap } from '~/services/draftJs/customStyleMap';

import { isReadonly, toApi, fromApi } from '../services';

import { CommonEditor } from './CommonEditor';

class ProblemWithInlinedAnswers extends React.Component {
  static propTypes = {
    mode: PropTypes.string.isRequired,
    problemContent: PropTypes.object,

    saveFn: PropTypes.func, // when 'editing'
  }

  // only when undefined
  static defaultProps = {
    problemContent: { content: null, explanation: null },
  }

  constructor(props) {
    super(props);

    this.state = {
      contentEditorState: fromApi(props.problemContent.content),
      explanationEditorState: fromApi(props.problemContent.explanation),
    };
  }

  onBlur = () => {
    console.log(this.state.contentEditorState.toJS().currentContent);
    if (this.props.mode === 'editingOld') {
      this.save();
    }
  }

  save = () =>
    this.props.saveFn({
      content: toApi(this.state.contentEditorState),
      explanation: toApi(this.state.explanationEditorState)
    })

  render = () =>
    <section className="problem -withInlinedAnswers">
      <div className="content first-column">
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
          decorators={// only initialized on mount
            (() => {
              switch (this.props.mode) {
                case 'viewing':
                case 'editingOld':
                case 'editingNew':
                  return [DraftJsDecorators.editableAnswer()];
                case 'solving':
                  return [DraftJsDecorators.solvableAnswer()];
              }
            })()
          }
          blockRenderMap={blockRenderMap()}
          customStyleMap={customStyleMap}
          readOnly={isReadonly(this.props.mode)}
          placeholder={isReadonly(this.props.mode) ? null : <div>Enter a short sentence you'll have to fill in.<br/> (To mark answer: SELECT it and press ENTER)</div>}
        />
      </div>

      <div className="explanation second-column">
        <CommonEditor
          mode={this.props.mode}
          editorState={this.state.explanationEditorState}
          onChange={newState => this.setState({ explanationEditorState: newState })}
          save={this.save}
          placeholder={isReadonly(this.props.mode) ? null : <div>Enter a more elaborate explanation <br/> or a few examples</div>}
        />
      </div>
    </section>
}


const mapStateToProps = () => ({});
const mapDispatchToProps = (dispatch) => ({
  inlinedAnswerGiven: () => dispatch({ type: 'INLINED_ANSWER_GIVEN' })
});

import { connect } from 'react-redux';
ProblemWithInlinedAnswers = connect(mapStateToProps, mapDispatchToProps)(ProblemWithInlinedAnswers);

export { ProblemWithInlinedAnswers };
