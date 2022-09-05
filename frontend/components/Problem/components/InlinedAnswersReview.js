/* eslint-disable no-param-reassign */
// because there is no alternative to el.readOnly
import { ReadonlyEditor } from '~/components/ReadonlyEditor';
import splitAltAnswers from './utils/splitAltAnswers';

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
      el.value = splitAltAnswers(el.getAttribute('data-answer')).join(' or ');
      el.setAttribute('data-answered', 'wrong');
      el.readOnly = true;
      el.setAttribute('tabindex', -1);

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

const _checkAnswer = (el, onRightAnswerGiven, nextInput) => {
  const answers = splitAltAnswers(el.getAttribute('data-answer'));
  const currentValue = el.value;

  const ifCanMarkAsRight = answers.find((answer) =>
    answer.toLowerCase() === currentValue.toLowerCase()
  );

  if (ifCanMarkAsRight) {
    el.setAttribute('value', currentValue.toLowerCase());
    el.setAttribute('data-answered', 'right');
    el.readOnly = true;
    el.setAttribute('tabindex', -1);

    if (nextInput) nextInput.focus({ preventScroll: true });

    onRightAnswerGiven();
  }
};

const attachKeyup = (arrayOfAnswerEls, onRightAnswerGiven) => {
  arrayOfAnswerEls.forEach((el, index) => {
    el.addEventListener('input', (event) => {
      // ___Why do we need this { return }?
      //    For korean typing issues.
      //    Fixes issue (https://github.com/lakesare/memcode/issues/165)
      //    By solution (https://github.com/vuejs/vue/issues/10277#issuecomment-873337252)
      if (event.isComposing || event.keyCode === 229) return;

      _adjustWidthToInput(el);
      const nextInput = arrayOfAnswerEls[index + 1] || null;
      _checkAnswer(el, onRightAnswerGiven, nextInput);
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
    Array.from(this.refs.problem.querySelectorAll('input.answer-input'));

  attachOnchangeToInputs = () => {
    const arrayOfAnswerEls = this.getArrayOfAnswerInputs();
    focusOnTheFirstAnswer(arrayOfAnswerEls);
    attachKeyup(arrayOfAnswerEls, this.props.onRightAnswerGiven);
  }

  render = () => {
    // '<mark class="answer">' => '</mark>'
    const content = this.props.problemContent.content
      .replace(
        /<mark class="answer">(.*?)<\/mark>/g,
        `<input
          class="answer-input"
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
