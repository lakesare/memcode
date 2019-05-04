import { Editor } from '~/components/Editor';

class SeparateAnswerEdit extends React.Component {
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
    <section className={`problem -withSeparateAnswer ${this.ifFocused() ? '-focused' : '-not-focused'}`}>
      <div className="first-column">
        <Editor
          placeholder="Enter a question"
          editorState={this.props.problemContent.content}
          updateEditorState={(newState) => this.updateProblemContent('content', newState)}
          onFocusChange={(value) => this.updateFocus('firstColumn', value)}
        />
      </div>

      <div className="second-column">
        <Editor
          placeholder="Enter an answer"
          editorState={this.props.problemContent.answer}
          updateEditorState={(newState) => this.updateProblemContent('answer', newState)}
          onFocusChange={(value) => this.updateFocus('secondColumn', value)}
        />
      </div>
    </section>
}

export { SeparateAnswerEdit };
