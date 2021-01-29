import { Editor } from '~/components/Editor';

class SeparateAnswerEdit extends React.Component {
  static propTypes = {
    problemContent: PropTypes.object.isRequired,
    updateProblemContent: PropTypes.func.isRequired,
    onFocusChange: PropTypes.func,
    ifWithPlaceholder: PropTypes.bool
  };

  static defaultProps = {
    onFocusChange: () => {}
  }

  // Remember whenever parent rerenders, all of its children will rerender.
  // Quill is insanely expensive to rerender.
  shouldComponentUpdate = (nextProps) => {
    return (
      this.props.problemContent.content !== nextProps.problemContent.content ||
      this.props.problemContent.answer !== nextProps.problemContent.answer
    );
  }

  updateProblemContent = (editorName, newEditorState) =>
    this.props.updateProblemContent({
      ...this.props.problemContent,
      [editorName]: newEditorState
    })

  onFocusChange = () => {
    this.props.onFocusChange();
  }

  render = () =>
    <section className="problem -withSeparateAnswer">
      <div className="first-column">
        <Editor
          placeholder={this.props.ifWithPlaceholder ? 'Enter a question' : ''}
          editorState={this.props.problemContent['content']}
          updateEditorState={(newState) => this.updateProblemContent('content', newState)}
          onFocusChange={this.onFocusChange}
        />
      </div>

      <div className="second-column">
        <Editor
          placeholder={this.props.ifWithPlaceholder ? 'Enter an answer' : ''}
          editorState={this.props.problemContent['answer']}
          updateEditorState={(newState) => this.updateProblemContent('answer', newState)}
          onFocusChange={this.onFocusChange}
        />
      </div>
    </section>
}

export { SeparateAnswerEdit };
