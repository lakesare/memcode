import { Editor } from '~/components/Editor';
import { ReadonlyEditor } from '~/components/ReadonlyEditor';

class ProblemWithSeparateAnswer_review extends React.Component {
  static propTypes = {
    problemContent: PropTypes.object.isRequired,

    mode: PropTypes.oneOf([
      'solving', 'seeingAnswer'
    ]).isRequired,
    enterPressed: PropTypes.func.isRequired
  }

  state = {
    draft: ''
  }

  render = () =>
    <section className="problem -withSeparateAnswer">
      <ReadonlyEditor className="first-column" html={this.props.problemContent.content}/>

      {
        this.props.mode === 'seeingAnswer' ?
          <ReadonlyEditor className="second-column" html={this.props.problemContent.answer}/> :
          <div className="second-column">
            <div
              className="see-answer"
              onClick={this.props.enterPressed}
            >See answer</div>

            <div className="draft-answer">
              <Editor
                editorState={this.state.draft}
                updateEditorState={draft => this.setState({ draft })}
                placeholder={<div>You can draft your answer here</div>}
              />
            </div>
          </div>
      }
    </section>
}

export { ProblemWithSeparateAnswer_review };
