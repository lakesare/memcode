import { ReadonlyEditor } from '~/components/ReadonlyEditor';

const focusOnTheFirstAnswer = () => {
  const answers = document.getElementsByClassName('answer');
  const firstAnswer = answers[0];
  if (firstAnswer) {
    firstAnswer.focus();
  }
};

const succumb = () => {
  Array.from(document.getElementsByClassName('answer')).forEach((el) => {
    if (el.getAttribute('data-answered') !== 'right') {
      el.setAttribute('value', el.getAttribute('data-answer'));
      el.setAttribute('data-answered', 'wrong');
      el.readOnly = true;
    }
  });
};

const attachKeyup = (onRightAnswerGiven) => {
  Array.from(document.getElementsByClassName('answer')).forEach((el) => {
    el.addEventListener('input', () => {
      const answer = el.getAttribute('data-answer');
      const currentValue = el.value;

      const ifCanMarkAsRight =
        currentValue.toLocaleLowerCase() === answer.toLocaleLowerCase();

      if (ifCanMarkAsRight) {
        el.setAttribute('value', answer);
        el.setAttribute('data-answered', 'right');
        el.readOnly = true;
        onRightAnswerGiven();
      }
    });
  });
};

class InlinedAnswersReview extends React.Component {
  static propTypes = {
    problemContent: PropTypes.object.isRequired,

    statusOfSolving: PropTypes.shape({
      status: PropTypes.oneOf([
        'solving', 'seeingAnswer'
      ])
    }).isRequired,

    onRightAnswerGiven: PropTypes.func.isRequired
  }

  componentDidMount() {
    focusOnTheFirstAnswer();
    attachKeyup(this.props.onRightAnswerGiven);
  }

  componentDidUpdate(prevProps) {
    const ifJustSuccumbed =
      prevProps.statusOfSolving.status === 'solving' &&
      this.props.statusOfSolving.status === 'seeingAnswer';

    if (ifJustSuccumbed) {
      succumb();
    }
  }

  render = () => {
    // '<mark class="answer">' => '</mark>'
    const content = this.props.problemContent.content
      .replace(/<mark class="answer">(.*?)<\/mark>/g,
        `<input
          class="answer"
          data-answer="$1"
          data-answered="waiting"
          value=""
        />`
      );

    return <section className="problem -withInlinedAnswers">
      <ReadonlyEditor className="first-column" html={content}/>

      <ReadonlyEditor className="second-column" html={this.props.problemContent.explanation}/>
    </section>;
  }
}

export { InlinedAnswersReview };
