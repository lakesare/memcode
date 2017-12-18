/* eslint-disable no-param-reassign */
// because there is no alternative to el.readOnly
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
      // ___why el.value instead of el.setAttribute('value')?
      //   we are modifying element's value propery rather than attribute
      //   because in HTML (unlike in react)
      //   value attribute is just the default value
      //   https://stackoverflow.com/a/29929977/3192470
      el.value = el.getAttribute('data-answer');
      el.setAttribute('data-answered', 'wrong');
      el.readOnly = true;

      adjustWidthToInput(el);
    }
  });
};

const adjustWidthToInput = (el) => {
  const nextLength = (el.value.length + 1) * 9;
  if (nextLength > 120) {
    el.style.width = nextLength + 'px';
  } else {
    el.style.width = '120px';
  }
};

const checkAnswer = (el, onRightAnswerGiven) => {
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
};

const attachKeyup = (onRightAnswerGiven) => {
  Array.from(document.getElementsByClassName('answer')).forEach((el) => {
    el.addEventListener('input', () => {
      adjustWidthToInput(el);
      checkAnswer(el, onRightAnswerGiven);
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
