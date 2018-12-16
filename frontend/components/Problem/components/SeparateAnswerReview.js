import { Editor } from '~/components/Editor';
import { ReadonlyEditor } from '~/components/ReadonlyEditor';

class SeparateAnswerReview extends React.Component {
  static propTypes = {
    problemContent: PropTypes.object.isRequired,

    statusOfSolving: PropTypes.shape({
      status: PropTypes.oneOf([
        'solving', 'seeingAnswer'
      ])
    }).isRequired,
    enterPressed: PropTypes.func.isRequired
  }

  state = {
    draft: '',
    ifDraftIsFocused: false
  }

  render = () =>
    <section className="problem -withSeparateAnswer">
      <div className="question-and-answer">
        <ReadonlyEditor className="question first-column" html={this.props.problemContent.content}/>

        {
          this.props.statusOfSolving.status === 'seeingAnswer' ?
            <ReadonlyEditor className="answer second-column" html={this.props.problemContent.answer}/> :
            <button
              type="button"
              className="see-answer-button second-column"
              onClick={this.props.enterPressed}
            >
              See answer
            </button>
        }
      </div>

      <div className={`draft-answer ${this.state.ifDraftIsFocused ? '-focused' : '-not-focused'}`}>
        <div className="first-column"/>
        <Editor
          className="second-column"
          placeholder="You can draft your answer here"
          editorState={this.state.draft}
          updateEditorState={(draft) => this.setState({ draft })}
          onFocusChange={(value) => this.setState({ ifDraftIsFocused: value })}
        />
      </div>
    </section>
}

export { SeparateAnswerReview };
