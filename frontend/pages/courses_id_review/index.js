import orFalse from '~/services/orFalse';

import Main from '~/appComponents/Main';
import Loading from '~/components/Loading';
import CourseActions from '~/components/CourseActions';
import ProblemBeingSolved from './components/ProblemBeingSolved';
import WhatsNext from './components/WhatsNext';
import Problem from '~/components/Problem';

import css from './index.css';
import MyDuck from '~/ducks/MyDuck';

// person pressed ENTER,
//   if there are answers in problem:
//     -> if person answered them all?
//       we accept problem and move to the next problem.
//     -> if person didnt answer some?
//       missing answers are inputted, get red and readonly.
//       person presses ENTER once again, we record their score and
//       move onto the next problem
//       WHATEVER I DONT CARE ACCEPT ANYWAY button
//
//   if there are no answers in problem:
//     -> we accept problem and move to the next problem
import selectors from './duck/selectors';
import actions from './duck/actions';
@connect(
  (state, ownProps) => {
    const pageState = state.pages.Page_courses_id_review;
    return {
      courseId: Number.parseInt(ownProps.match.params.id),
      currentUser: state.global.Authentication.currentUser || false,
      currentProblem: selectors.deriveCurrentProblem(pageState),
      speGetPage: pageState.speGetPage,
      speNextReviewIn: pageState.speNextReviewIn,
      ifReviewingFailedProblems: pageState.ifReviewingFailedProblems,

      ...pageState.speGetPage.status === 'success' &&
        {
          statusOfSolving:  pageState.statusOfSolving,
          amountOfProblems: pageState.speGetPage.payload.problems.length
        },
      amountOfFailedProblems: pageState.amountOfFailedProblems,
      amountOfFailedProblemsLeft: pageState.indexesOfFailedProblems.length,

      My: state.global.My
    };
  },
  (dispatch, ownProps) => ({
    getPage: (courseId) => dispatch(
      actions.getPage(courseId, ownProps.simulated)
    ),
    enterPressed: () => {
      ownProps.simulated ?
        dispatch(actions.enterPressedInSimulatedReview()) :
        dispatch(actions.enterPressed());
    },
    separateAnswerSelfScoreGiven: (selfScore) =>
      dispatch({
        type: 'SEPARATE_ANSWER_SELF_SCORE_GIVEN',
        payload: selfScore
      }),
    onRightAnswerGiven: () => dispatch({ type: 'INLINED_ANSWER_GIVEN' }),
    randomizeProblems: () => dispatch({ type: 'RANDOMIZE_PROBLEMS' }),
    switchQuestionAndAnswer: () => dispatch({ type: 'SWITCH_QUESTION_AND_ANSWER' }),

    MyActions: dispatch(MyDuck.getActions)
  })
)
class Page_courses_id_review extends React.Component {
  static propTypes = {
    courseId: PropTypes.number.isRequired,
    simulated: PropTypes.bool,
    getPage: PropTypes.func.isRequired,

    speGetPage: PropTypes.object.isRequired,
    speNextReviewIn: PropTypes.object.isRequired,

    currentUser: orFalse(PropTypes.object).isRequired,
    currentProblem: PropTypes.object,
    statusOfSolving: PropTypes.object,
    enterPressed: PropTypes.func.isRequired,
    amountOfProblems: PropTypes.number,
    amountOfFailedProblems: PropTypes.number.isRequired,
    amountOfFailedProblemsLeft: PropTypes.number.isRequired,
    ifReviewingFailedProblems: PropTypes.bool.isRequired,

    separateAnswerSelfScoreGiven: PropTypes.func.isRequired,
    onRightAnswerGiven: PropTypes.func.isRequired,
    randomizeProblems: PropTypes.func.isRequired,
    switchQuestionAndAnswer: PropTypes.func.isRequired,

    MyActions: PropTypes.object.isRequired,
    My: PropTypes.object.isRequired
  }

  static defaultProps = {
    simulated: false
  }

  componentDidMount() {
    this.props.getPage(this.props.courseId);
    this.props.MyActions.apiGetCourseForActions(this.props.courseId);
  }

  componentDidUpdate = (prevProps) => {
    if (prevProps.courseId !== this.props.courseId) {
      this.props.getPage(this.props.courseId);
      this.props.MyActions.apiGetCourseForActions(this.props.courseId);
    }
  }

  renderProblemContentCachingMechanism = (problems) =>
    <div style={{ display: 'none' }}>{
      problems.map((problem) =>
        <Problem
          key={problem.id}
          mode="show"
          problemContent={problem.content}
          problemType={problem.type}
        />
      )
    }</div>

  render = () =>
    <Main className={css.main} dontLinkToLearnOrReview={this.props.courseId}>
      <CourseActions
        courseId={this.props.courseId}
        currentUser={this.props.currentUser}
        type="review"
        My={this.props.My}
        MyActions={this.props.MyActions}
      />

      {
        this.props.currentProblem &&
        <ProblemBeingSolved
          problem={this.props.currentProblem}
          ifReviewIsSimulated={this.props.simulated}
          ifReviewingFailedProblems={this.props.ifReviewingFailedProblems}
          statusOfSolving={this.props.statusOfSolving}
          amountOfProblems={this.props.amountOfProblems}
          amountOfFailedProblems={this.props.amountOfFailedProblems}
          amountOfFailedProblemsLeft={this.props.amountOfFailedProblemsLeft}

          enterPressed={this.props.enterPressed}
          separateAnswerSelfScoreGiven={this.props.separateAnswerSelfScoreGiven}
          onRightAnswerGiven={this.props.onRightAnswerGiven}
          randomizeProblems={this.props.randomizeProblems}
          switchQuestionAndAnswer={this.props.switchQuestionAndAnswer}
        />
      }
      <Loading className="loading-flashcards" spe={this.props.speGetPage}/>

      <WhatsNext
        courseId={parseInt(this.props.courseId)}
        currentUser={this.props.currentUser}
        speNextReviewIn={this.props.speNextReviewIn}
        ifDisplay={this.props.speGetPage.status === 'success' && !this.props.currentProblem}
      />

      {
        this.props.speGetPage.status === 'success' &&
        this.renderProblemContentCachingMechanism(this.props.speGetPage.payload.problems)
      }
    </Main>
}

export default Page_courses_id_review;
