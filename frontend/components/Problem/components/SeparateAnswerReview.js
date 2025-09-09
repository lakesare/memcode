import { ReadonlyEditor } from '~/components/ReadonlyEditor';
import AudioButton from '~/components/AudioButton';
import TtsService from '~/services/ttsService';

class SeparateAnswerReview extends React.Component {
  static propTypes = {
    problemId: PropTypes.number.isRequired,
    problemContent: PropTypes.object.isRequired,

    statusOfSolving: PropTypes.shape({
      status: PropTypes.oneOf([
        'solving', 'seeingAnswer'
      ])
    }).isRequired,
    enterPressed: PropTypes.func.isRequired
  }

  componentDidMount = () => {
    this.uiFocusOnSeeAnswerButton();
  }

  componentDidUpdate = (prevProps) => {
    const ifProblemChanged =
      prevProps.problemId !== this.props.problemId;
    if (ifProblemChanged) {
      this.uiFocusOnSeeAnswerButton();
    }
  }

  uiFocusOnSeeAnswerButton = () => {
    document.querySelector('body').click();
  }

  render = () =>
    <section className="problem -withSeparateAnswer">
      <ReadonlyEditor 
        className="question first-column" 
        html={this.props.problemContent.content}
        audioText={TtsService.stripHtml(this.props.problemContent.content)}
      />

      {
        this.props.statusOfSolving.status === 'seeingAnswer' ?
          <ReadonlyEditor 
            className="answer second-column" 
            html={this.props.problemContent.answer}
            audioText={TtsService.stripHtml(this.props.problemContent.answer)}
          /> :
          <div className="second-column">
            <button
              type="button"
              className="see-answer-button"
              onClick={this.props.enterPressed}
            >
              See answer
            </button>
          </div>
      }
    </section>
}

export { SeparateAnswerReview };
