/* eslint-disable no-param-reassign */
// because there is no alternative to el.readOnly
import { ReadonlyEditor } from '~/components/ReadonlyEditor';

const focusOnTheFirstAnswer = (arrayOfAnswerEls) => {
  const answers = arrayOfAnswerEls;
  const firstAnswer = answers[0];
  if (firstAnswer) {
    firstAnswer.focus();
  }
};

const succumb = (arrayOfAnswerEls) => {
  arrayOfAnswerEls.forEach((el) => {
    if (el.getAttribute('data-answered') !== 'right') {
      // ___why el.value instead of el.setAttribute('value')?
      //   we are modifying element's value propery rather than attribute
      //   because in HTML (unlike in react)
      //   value attribute is just the default value
      //   https://stackoverflow.com/a/29929977/3192470
      el.value = el.getAttribute('data-answer');
      el.setAttribute('data-answered', 'wrong');
      el.readOnly = true;

      _adjustWidthToInput(el);
    }
  });
};

const retry = (arrayOfAnswerEls) => {
  arrayOfAnswerEls.forEach((el) => {
    // ___why el.value instead of el.setAttribute('value')?
    //   we are modifying element's value propery rather than attribute
    //   because in HTML (unlike in react)
    //   value attribute is just the default value
    //   https://stackoverflow.com/a/29929977/3192470
    el.value = '';
    el.setAttribute('data-answered', 'waiting');
    el.readOnly = false;

    _adjustWidthToInput(el);
  });
};

const _adjustWidthToInput = (el) => {
  const nextLength = (el.value.length + 1) * 9;
  if (nextLength > 120) {
    el.style.width = nextLength + 'px';
  } else {
    el.style.width = '120px';
  }
};

const _checkAnswer = (el, onRightAnswerGiven) => {
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

const attachKeyup = (arrayOfAnswerEls, onRightAnswerGiven) => {
  arrayOfAnswerEls.forEach((el) => {
    console.log(arrayOfAnswerEls);
    el.addEventListener('input', () => {
      console.log('input!!!');
      _adjustWidthToInput(el);
      _checkAnswer(el, onRightAnswerGiven);
    });
  });
};

class InlinedAnswersReview extends React.Component {
  static propTypes = {
    problemId: PropTypes.number.isRequired,

    problemContent: PropTypes.object.isRequired,

    statusOfSolving: PropTypes.shape({
      status: PropTypes.oneOf([
        'solving', 'seeingAnswer'
      ])
    }).isRequired,

    onRightAnswerGiven: PropTypes.func.isRequired
  }

  componentDidMount() {
    this.attachOnchangeToInputs();
  }

  componentDidUpdate(prevProps) {
    const arrayOfAnswerEls = this.getArrayOfAnswerInputs();

    const prevStatus = prevProps.statusOfSolving.status;
    const nextStatus = this.props.statusOfSolving.status;

    const ifJustSuccumbed =
      prevStatus === 'solving' &&
      nextStatus === 'seeingAnswer';
    if (ifJustSuccumbed) succumb(arrayOfAnswerEls);

    const ifJustDecidedToRetry =
      prevStatus === 'seeingAnswer' &&
      nextStatus === 'solving';
    if (ifJustDecidedToRetry) retry(arrayOfAnswerEls);

    const ifProblemChanged =
      prevProps.problemId !== this.props.problemId;
    if (ifProblemChanged) this.attachOnchangeToInputs();
  }

  getArrayOfAnswerInputs = () =>
    Array.from(this.refs.problem.querySelectorAll('.answer'));

  attachOnchangeToInputs = () => {
    const arrayOfAnswerEls = this.getArrayOfAnswerInputs();
    focusOnTheFirstAnswer(arrayOfAnswerEls);
    attachKeyup(arrayOfAnswerEls, this.props.onRightAnswerGiven);
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

    return <section className="problem -withInlinedAnswers" ref="problem">
      <ReadonlyEditor className="first-column" html={content}/>
      <ReadonlyEditor className="second-column" html={this.props.problemContent.explanation}/>
    </section>;
  }
}

export { InlinedAnswersReview };
