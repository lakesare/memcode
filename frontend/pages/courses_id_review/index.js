import { orFalse } from '~/services/orFalse';

import { Header }  from '~/components/Header';
import { Loading } from '~/components/Loading';
import { CourseActions } from '~/components/CourseActions';
import { ProblemBeingSolved } from './components/ProblemBeingSolved';
import { WhatNext } from './components/WhatNext';
import { Problem } from '~/components/Problem';


import css from './index.css';

// person pressed ENTER,
//   if there are answers in problem:
//     -> if person answered them all?
//       we accept problem and move to the next problem.
//     -> if person didnt answer some?
//       missing answers are inputted, get red and readonly.
//       person presses ENTER once again, we record their score and
//       move onto the next problem
//       WHATEVER I DONT CARE ACCEPT ANYWAY button

//   if there are no answers in problem:
//     -> we accept problem and move to the next problem
import selectors from './duck/selectors';
import actions from './duck/actions';
@connect(
  (state) => {
    const pageState = state.pages.Page_courses_id_review;
    return {
      currentUser: state.global.Authentication.currentUser || false,
      currentProblem: selectors.deriveCurrentProblem(pageState),
      speGetPage: pageState.speGetPage,
      speNextReviewIn: pageState.speNextReviewIn,
      ifReviewingFailedProblems: pageState.ifReviewingFailedProblems,

      ...pageState.speGetPage.status === 'success' &&
        {
          statusOfSolving:  pageState.statusOfSolving,
          amountOfProblems: pageState.speGetPage.payload.problems.length
        }
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
    switchQuestionAndAnswer: () => dispatch({ type: 'SWITCH_QUESTION_AND_ANSWER' })
  })
)
class Page_courses_id_review extends React.Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string
      })
    }).isRequired,
    simulated: PropTypes.bool,
    getPage: PropTypes.func.isRequired,

    speGetPage: PropTypes.object.isRequired,
    speNextReviewIn: PropTypes.object.isRequired,

    currentUser: orFalse(PropTypes.object).isRequired,
    currentProblem: PropTypes.object,
    statusOfSolving: PropTypes.object,
    enterPressed: PropTypes.func.isRequired,
    amountOfProblems: PropTypes.number,
    ifReviewingFailedProblems: PropTypes.bool.isRequired,

    separateAnswerSelfScoreGiven: PropTypes.func.isRequired,
    onRightAnswerGiven: PropTypes.func.isRequired,
    randomizeProblems: PropTypes.func.isRequired
  }

  static defaultProps = {
    simulated: false
  }

  componentDidMount() {
    this.props.getPage(this.props.match.params.id);
    document.body.style.background = 'rgb(19, 2, 2)';
  }

  componentDidUpdate = (prevProps) => {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      this.props.getPage(this.props.match.params.id);
    }
  }

  componentWillUnmount() {
    document.body.style.background = '';
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
    <main className={css.main} key={this.props.match.params.id}>
      <Header dontLinkToLearnOrReview={this.props.match.params.id}/>

      <CourseActions courseId={this.props.match.params.id} ifCuilActivityButtonsAreDisplayed={false}/>
      <Loading spe={this.props.speGetPage}>{({ problems }) =>
        <div className="container">
          {
            this.props.currentProblem &&
            <ProblemBeingSolved
              key={this.props.currentProblem.id} // is needed, otherwise Editor will just stay the same
              problem={this.props.currentProblem}
              ifReviewIsSimulated={this.props.simulated}
              ifReviewingFailedProblems={this.props.ifReviewingFailedProblems}
              statusOfSolving={this.props.statusOfSolving}
              amountOfProblems={this.props.amountOfProblems}

              enterPressed={this.props.enterPressed}
              separateAnswerSelfScoreGiven={this.props.separateAnswerSelfScoreGiven}
              onRightAnswerGiven={this.props.onRightAnswerGiven}
              randomizeProblems={this.props.randomizeProblems}
              switchQuestionAndAnswer={this.props.switchQuestionAndAnswer}
            />
          }

          <WhatNext
            courseId={parseInt(this.props.match.params.id)}
            currentUser={this.props.currentUser}
            speNextReviewIn={this.props.speNextReviewIn}
            ifDisplay={!this.props.currentProblem}
          />

          {this.renderProblemContentCachingMechanism(problems)}
        </div>
      }</Loading>
    </main>
}

export default Page_courses_id_review;
