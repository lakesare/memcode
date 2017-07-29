import { ReadonlyEditor } from '~/components/ReadonlyEditor';

class ProblemWithSeparateAnswer_show extends React.Component {
  static propTypes = {
    problemContent: PropTypes.object.isRequired
  }

  render = () =>
    <section className="problem -withSeparateAnswer ql-snow">
      <ReadonlyEditor className="first-column" html={this.props.problemContent.content}/>
      <ReadonlyEditor className="second-column" html={this.props.problemContent.answer}/>
    </section>
}

export { ProblemWithSeparateAnswer_show };
