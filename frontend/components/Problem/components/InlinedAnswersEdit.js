import standardToolbarContainer from '~/services/quill/standardToolbarContainer';
import markAsAnswerHandler from '~/services/quill/handlers/markAsAnswerHandler';

import Editor from '~/components/Editor';

class InlinedAnswersEdit extends React.Component {
  static propTypes = {
    problemContent: PropTypes.object.isRequired,
    updateProblemContent: PropTypes.func.isRequired,
    apiSave: PropTypes.func
  };

  static defaultProps = {
    apiSave: () => {}
  }

  updateProblemContent = (editorName, newEditorState) =>
    this.props.updateProblemContent({
      ...this.props.problemContent,
      [editorName]: newEditorState
    })

  onFocusChange = (ifFocused) => {
    if (ifFocused === false) {
      this.props.apiSave();
    }
  }

  render = () =>
    <section className="problem -withInlinedAnswers">
      <div className="first-column">
        <Editor
          placeholder="Enter a sentence, and mark words you'd like to learn As Answers"
          editorState={this.props.problemContent.content}
          updateEditorState={(newState) => this.updateProblemContent('content', newState)}
          onFocusChange={this.onFocusChange}

          toolbarContainer={[['answer'], ...standardToolbarContainer]}
          toolbarHandlers={{ answer: markAsAnswerHandler }}
        />
      </div>

      <div className="second-column">
        <Editor
          placeholder="Enter some additional information/hint"
          editorState={this.props.problemContent.explanation}
          updateEditorState={(newState) => this.updateProblemContent('explanation', newState)}
          onFocusChange={this.onFocusChange}
        />
      </div>
    </section>
}

export { InlinedAnswersEdit };
