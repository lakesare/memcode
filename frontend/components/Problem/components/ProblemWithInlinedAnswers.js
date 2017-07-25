import { Editor } from 'slate';

import { isReadonly, fromApi } from '../services';

import { CommonEditor } from './CommonEditor';

class ProblemWithInlinedAnswers extends React.Component {
  static propTypes = {
    mode: PropTypes.string.isRequired,

    problemContent: PropTypes.object,
    updateProblemContent: PropTypes.func.isRequired
  }

  static defaultProps = {
    problemContent: { content: fromApi(null), explanation: fromApi(null) }
  }

  updateProblemContent = (editorName, newEditorState) => {
    this.props.updateProblemContent({
      ...this.props.problemContent,
      [editorName]: newEditorState
    });
  }

  render = () =>
    <section className="problem -withInlinedAnswers">
      <div className="content first-column">
        <Editor
          editorState={this.props.problemContent.content}
          onChange={newState => this.updateProblemContent('content', newState)}
          plugins={[
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

// <CommonEditor
//   mode={this.props.mode}
//   editorState={this.props.problemContent.explanation}
//   onChange={newState => this.updateProblemContent('explanation', newState)}
//   placeholder={isReadonly(this.props.mode) ? null : <div>Enter a more elaborate explanation <br/> or a few examples</div>}
// />
