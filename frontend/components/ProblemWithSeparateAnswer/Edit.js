import { Editor } from '~/components/Editor';

class ProblemWithSeparateAnswer_edit extends React.Component {
  static propTypes = {
    problemContent: PropTypes.object.isRequired,
    updateProblemContent: PropTypes.func.isRequired
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
    this.state.focus.firstColumn || this.state.focus.secondColumn

  render = () =>
    <section className={`problem -withSeparateAnswer ${this.ifFocused() ? '-focused' : '-not-focused'}`}>
      <div className="first-column">
        <Editor
          editorState={this.props.problemContent.content}
          updateEditorState={newState => this.updateProblemContent('content', newState)}
          placeholder={<h1>1</h1>}
          onFocusChange={(value) => this.updateFocus('firstColumn', value)}
        />
      </div>

      <div className="second-column">
        <Editor
          editorState={this.props.problemContent.answer}
          updateEditorState={newState => this.updateProblemContent('answer', newState)}
          placeholder={<h1>2</h1>}
          onFocusChange={(value) => this.updateFocus('secondColumn', value)}
        />
      </div>
    </section>
}

export { ProblemWithSeparateAnswer_edit };
