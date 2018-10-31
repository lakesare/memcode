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

  renderDraftAnswerEditor = () =>
    <div className={`draft-answer ${this.state.ifDraftIsFocused ? '-focused' : '-not-focused'}`}>
      <Editor
        placeholder="You can draft your answer here"
        editorState={this.state.draft}
        updateEditorState={(draft) => this.setState({ draft })}
        onFocusChange={(value) => this.setState({ ifDraftIsFocused: value })}
      />
    </div>

  render = () =>
    <section className="problem -withSeparateAnswer">
      <ReadonlyEditor className="first-column" html={this.props.problemContent.content}/>

      {
        this.props.statusOfSolving.status === 'seeingAnswer' ?
          <div className="second-column">
            <ReadonlyEditor html={this.props.problemContent.answer}/>

            {this.renderDraftAnswerEditor()}
          </div> :
          <div className="second-column">
            <div
              className="see-answer button"
              onClick={this.props.enterPressed}
            >See answer</div>

            {this.renderDraftAnswerEditor()}
          </div>
      }
    </section>
}

export { SeparateAnswerReview };
