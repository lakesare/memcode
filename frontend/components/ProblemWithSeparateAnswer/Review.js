import { Plain } from 'slate';
import { SlateEditor } from '~/components/SlateEditor';

class ProblemWithSeparateAnswer_review extends React.Component {
  static propTypes = {
    problemContent: PropTypes.object.isRequired,

    mode: PropTypes.oneOf([
      'solving', 'seeingAnswer'
    ]).isRequired,
    enterPressed: PropTypes.func.isRequired
  }

  state = {
    draft: Plain.deserialize('')
  }

  render = () =>
    <section className="problem -withSeparateAnswer">
      <div className="first-column">
        <SlateEditor
          editorState={this.props.problemContent.content}
          placeholder={<h1>1</h1>}
          readOnly
        />
      </div>

      <div className="second-column">
        {
          this.props.mode === 'solving' ?
            <div
              className="see-answer"
              onClick={this.props.enterPressed}
            >See answer</div> :
            <SlateEditor
              editorState={this.props.problemContent.answer}
              placeholder={<h1>2</h1>}
              readOnly
            />
        }

        { // when 'solving' always have draft answer editor available
          this.props.mode === 'solving' &&
          <div className="draft-answer">
            <SlateEditor
              editorState={this.state.draft}
              updateEditorState={draft => this.setState({ draft })}
              placeholder={<div>You can draft your answer here</div>}
            />
          </div>
        }
      </div>
    </section>
}

export { ProblemWithSeparateAnswer_review };
