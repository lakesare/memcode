import { ReadonlyEditor } from '~/components/ReadonlyEditor';

class SeparateAnswerShow extends React.Component {
  static propTypes = {
    problemContent: PropTypes.object.isRequired
  }

  render = () =>
    <section className="problem -withSeparateAnswer ql-snow">
      <div className="first-column">
        <ReadonlyEditor html={this.props.problemContent.content}/>
      </div>
      <div className="second-column">
        <ReadonlyEditor html={this.props.problemContent.answer}/>
      </div>
    </section>
}

export { SeparateAnswerShow };
