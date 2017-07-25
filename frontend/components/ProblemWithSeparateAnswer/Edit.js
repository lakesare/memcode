import { SlateEditor } from '~/components/SlateEditor';

class ProblemWithSeparateAnswer_edit extends React.Component {
  static propTypes = {
    problemContent: PropTypes.object.isRequired,
    updateProblemContent: PropTypes.func.isRequired
  }

  updateProblemContent = (editorName, newEditorState) =>
    this.props.updateProblemContent({
      ...this.props.problemContent,
      [editorName]: newEditorState
    })

  render = () =>
    <section className="problem -withSeparateAnswer">
      <div className="first-column">
        <SlateEditor
          editorState={this.props.problemContent.content}
          updateEditorState={newState => this.updateProblemContent('content', newState)}
          placeholder={<h1>1</h1>}
        />
      </div>

      <div className="second-column">
        <SlateEditor
          editorState={this.props.problemContent.answer}
          updateEditorState={newState => this.updateProblemContent('answer', newState)}
          placeholder={<h1>2</h1>}
        />
      </div>
    </section>
}

export { ProblemWithSeparateAnswer_edit };
