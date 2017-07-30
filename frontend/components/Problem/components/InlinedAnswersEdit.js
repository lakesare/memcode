import { standardToolbarContainer } from '~/services/quill/standardToolbarContainer';
import { answerHandler } from '~/services/quill/answerHandler';

import { Editor } from '~/components/Editor';

class InlinedAnswersEdit extends React.Component {
  static propTypes = {
    problemContent: PropTypes.object.isRequired,
    updateProblemContent: PropTypes.func.isRequired,
    ifNewProblem: PropTypes.bool,
    apiSave: PropTypes.func
  };

  static defaultProps = {
    ifNewProblem: false,
    apiSave: () => {}
  }

  state = {
    focus: {
      firstColumn: false,
      secondColumn: false
    }
  }

  componentDidUpdate = (prevProps, prevState) => {
    const ifWasFocused =
      prevState.focus.firstColumn ||
      prevState.focus.secondColumn;

    const ifIsFocused = this.ifFocused();

    if (ifWasFocused && !ifIsFocused) {
      this.props.apiSave();
    }
  }

  updateProblemContent = (editorName, newEditorState) =>
    this.props.updateProblemContent({
      ...this.props.problemContent,
      [editorName]: newEditorState
    })

  updateFocus = (name, value) =>
    this.setState({
      focus: {
        ...this.state.focus,
        [name]: value
      }
    })

  ifFocused = () =>
    this.props.ifNewProblem ||
    (
      this.state.focus.firstColumn ||
      this.state.focus.secondColumn
    )

  render = () =>
    <section className={`problem -withInlinedAnswers ${this.ifFocused() ? '-focused' : '-not-focused'}`}>
      <div className="first-column">
        <Editor
          placeholder="Enter a sentence, and mark words you'd like to learn As Answers"
          editorState={this.props.problemContent.content}
          updateEditorState={newState => this.updateProblemContent('content', newState)}
          onFocusChange={(value) => this.updateFocus('firstColumn', value)}

          toolbarContainer={[['answer'], ...standardToolbarContainer]}
          toolbarHandlers={{ answer: answerHandler }}
        />
      </div>

      <div className="second-column">
        <Editor
          placeholder="Enter some additional information/hint"
          editorState={this.props.problemContent.explanation}
          updateEditorState={newState => this.updateProblemContent('explanation', newState)}
          onFocusChange={(value) => this.updateFocus('secondColumn', value)}
        />
      </div>
    </section>
}

export { InlinedAnswersEdit };
