import { ReadonlyEditor } from '~/components/ReadonlyEditor';

class InlinedAnswersShow extends React.Component {
  static propTypes = {
    problemContent: PropTypes.object.isRequired
  }

  render = () =>
    <section className="problem -withInlinedAnswers">
      <div className="first-column">
        <ReadonlyEditor html={this.props.problemContent.content}/>
      </div>
      <div className="second-column">
        <ReadonlyEditor html={this.props.problemContent.explanation}/>
      </div>
    </section>
}

export { InlinedAnswersShow };
