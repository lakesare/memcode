import { SlateEditor } from '~/components/SlateEditor';

class ProblemWithSeparateAnswer_show extends React.Component {
  static propTypes = {
    problemContent: PropTypes.object.isRequired
  }

  render = () =>
    <section className="problem -withSeparateAnswer">
      <div className="first-column">
        <SlateEditor
          editorState={this.props.problemContent.content}
          placeholder={<h1>1</h1>}
        />
      </div>

      <div className="second-column">
        <SlateEditor
          editorState={this.props.problemContent.answer}
          placeholder={<h1>2</h1>}
        />
      </div>
    </section>
}

export { ProblemWithSeparateAnswer_show };
