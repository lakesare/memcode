import { Editor } from '~/components/Editor';

class InlinedAnswersEdit extends React.Component {
  static propTypes = {
    problemContent: PropTypes.object.isRequired,
    updateProblemContent: PropTypes.func.isRequired,
    ifNewProblem: PropTypes.bool
  };

  static defaultProps = {
    ifNewProblem: false
  }

  state = {
    focus: {
      firstColumn: false,
      secondColumn: false
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
          placeholder="Enter content"
          editorState={this.props.problemContent.content}
          updateEditorState={newState => this.updateProblemContent('content', newState)}
          onFocusChange={(value) => this.updateFocus('firstColumn', value)}
        />
      </div>

      <div className="second-column">
        <Editor
          placeholder="Enter an explanation"
          editorState={this.props.problemContent.explanation}
          updateEditorState={newState => this.updateProblemContent('explanation', newState)}
          onFocusChange={(value) => this.updateFocus('secondColumn', value)}
        />
      </div>
    </section>
}

export { InlinedAnswersEdit };
