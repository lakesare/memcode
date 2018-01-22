import { orFalse } from '~/services/orFalse';

import { Header }  from '~/components/Header';
import { Loading } from '~/components/Loading';
import { CourseActions } from '~/components/CourseActions';
import { ProblemBeingSolved } from './components/ProblemBeingSolved';
import { WhatNext } from './components/WhatNext';

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
import { deriveCurrentProblem } from './selectors';
import { Page_courses_id_review_Actions as pageActions } from './reducer';
@connect(
  (state) => {
    const pageState = state.pages.Page_courses_id_review;
    return {
      currentUser: state.global.Authentication.currentUser || false,
      currentProblem: deriveCurrentProblem(pageState),
      speGetPage: pageState.speGetPage,

      ...pageState.speGetPage.status === 'success' &&
        {
          statusOfSolving:  pageState.statusOfSolving,
          amountOfProblems: pageState.speGetPage.payload.problems.length
        }
    };
  },
  (dispatch, ownProps) => ({
    getPage: (courseId) => dispatch(
      pageActions.getPage(courseId, ownProps.route.simulated)
    ),
    enterPressed: () => {
      ownProps.route.simulated ?
        dispatch(pageActions.enterPressedInSimulatedReview()) :
        dispatch(pageActions.enterPressed());
    },
    separateAnswerSelfScoreGiven: (selfScore) =>
      dispatch({
        type: 'SEPARATE_ANSWER_SELF_SCORE_GIVEN',
        payload: selfScore
      }),
    onRightAnswerGiven: () => dispatch({ type: 'INLINED_ANSWER_GIVEN' }),
    randomizeProblems: () => dispatch({ type: 'RANDOMIZE_PROBLEMS' })
  })
)
class Page_courses_id_review extends React.Component {
  static propTypes = {
    params: PropTypes.shape({
      id: PropTypes.string
    }).isRequired,
    route: PropTypes.shape({
      simulated: PropTypes.bool
    }).isRequired,
    getPage: PropTypes.func.isRequired,

    speGetPage: PropTypes.object.isRequired,

    currentUser: orFalse(PropTypes.object).isRequired,
    currentProblem: PropTypes.object,
    statusOfSolving: PropTypes.object,
    enterPressed: PropTypes.func.isRequired,
    amountOfProblems: PropTypes.number,

    separateAnswerSelfScoreGiven: PropTypes.func.isRequired,
    onRightAnswerGiven: PropTypes.func.isRequired,
    randomizeProblems: PropTypes.func.isRequired
  }

  componentDidMount() {
    this.props.getPage(this.props.params.id);

    document.body.style.background = 'rgb(37, 37, 39)';
  }

  componentDidUpdate = (prevProps) => {
    if (prevProps.params.id !== this.props.params.id) {
      this.props.getPage(this.props.params.id);
    }
  }

  componentWillUnmount() {
    document.body.style.background = '';
  }

  render = () =>
    <main className={css.main} key={this.props.params.id}>
      <Header/>

      <CourseActions courseId={this.props.params.id} ifCuilActivityButtonsAreDisplayed={false}/>
      <Loading spe={this.props.speGetPage}>{() =>
        <div className="container">
          {
            this.props.currentProblem ?
              <ProblemBeingSolved
                key={this.props.currentProblem.id} // is needed, otherwise Editor will just stay the same
                problem={this.props.currentProblem}
                ifReviewIsSimulated={this.props.route.simulated}
                statusOfSolving={this.props.statusOfSolving}
                amountOfProblems={this.props.amountOfProblems}

                enterPressed={this.props.enterPressed}
                separateAnswerSelfScoreGiven={this.props.separateAnswerSelfScoreGiven}
                onRightAnswerGiven={this.props.onRightAnswerGiven}
                randomizeProblems={this.props.randomizeProblems}
              /> :
              <WhatNext courseId={parseInt(this.props.params.id)} currentUser={this.props.currentUser}/>
          }
        </div>
      }</Loading>
    </main>
}

export { Page_courses_id_review };
