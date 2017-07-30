import { ReadonlyEditor } from '~/components/ReadonlyEditor';

class InlinedAnswersShow extends React.Component {
  static propTypes = {
    problemContent: PropTypes.object.isRequired
  }

  render = () =>
    <section className="problem -withInlinedAnswers">
      <ReadonlyEditor className="first-column" html={this.props.problemContent.content}/>
      <ReadonlyEditor className="second-column" html={this.props.problemContent.explanation}/>
    </section>
}

export { InlinedAnswersShow };
