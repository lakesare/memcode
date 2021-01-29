import standardToolbarContainer from '~/services/quill/standardToolbarContainer';
import markAsAnswerHandler from '~/services/quill/handlers/markAsAnswerHandler';

import Editor from '~/components/Editor';

class InlinedAnswersEdit extends React.Component {
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
      this.props.problemContent.explanation !== nextProps.problemContent.explanation
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
    <section className="problem -withInlinedAnswers">
      <div className="first-column">
        <Editor
          placeholder={this.props.ifWithPlaceholder ? "Enter a sentence, and mark the words you'd like to learn" : ''}
          editorState={this.props.problemContent.content}
          updateEditorState={(newState) => this.updateProblemContent('content', newState)}
          onFocusChange={this.onFocusChange}

          toolbarContainer={[['answer'], ...standardToolbarContainer]}
          toolbarHandlers={{ answer: markAsAnswerHandler }}
        />
      </div>

      <div className="second-column">
        <Editor
          placeholder={this.props.ifWithPlaceholder ? "Enter some additional information/hint" : ''}
          editorState={this.props.problemContent.explanation}
          updateEditorState={(newState) => this.updateProblemContent('explanation', newState)}
          onFocusChange={this.onFocusChange}
        />
      </div>
    </section>
}

export { InlinedAnswersEdit };
