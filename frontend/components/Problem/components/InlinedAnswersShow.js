import { ReadonlyEditor } from '~/components/ReadonlyEditor';

class InlinedAnswerShow extends React.Component {
  static propTypes = {
    problemContent: PropTypes.object.isRequired
  }

  render = () =>
    <section className="problem -withSeparateAnswer ql-snow">
      <ReadonlyEditor className="first-column" html={this.props.problemContent.content}/>
      <ReadonlyEditor className="second-column" html={this.props.problemContent.explanation}/>
    </section>
}

export { InlinedAnswerShow };
