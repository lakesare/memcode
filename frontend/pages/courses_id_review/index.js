import { Header }  from '~/components/Header';
import { Footer } from '~/components/Footer';
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

    currentProblem: PropTypes.object,
    statusOfSolving: PropTypes.object,
    enterPressed: PropTypes.func.isRequired,
    amountOfProblems: PropTypes.number
  }

  componentDidMount() {
    this.props.getPage(this.props.params.id);

    document.body.style.background = '#383131';
  }

  // https://github.com/ReactTraining/react-router/issues/1487
  // because router doesn't remount components if only properties (params.id) changed.
  componentWillReceiveProps(nextProps) {
    if (nextProps.params.id !== this.props.params.id) {
      this.props.getPage(nextProps.params.id);
    }
  }

  componentWillUnmount() {
    document.body.style.background = '';
  }

  render = () =>
    <main className={css.main}>
      <Header/>

      <Loading spe={this.props.speGetPage}>{() =>
        <div className="container">
          <CourseActions courseId={this.props.params.id} ifCuilActivityButtonsAreDisplayed={false}/>

          {
            this.props.currentProblem ?
              <ProblemBeingSolved
                key={this.props.currentProblem.id} // is needed, otherwise Editor will just stay the same
                problem={this.props.currentProblem}
                ifReviewIsSimulated={this.props.route.simulated}
                statusOfSolving={this.props.statusOfSolving}
                enterPressed={this.props.enterPressed}

                separateAnswerSelfScoreGiven={this.props.separateAnswerSelfScoreGiven}
                onRightAnswerGiven={this.props.onRightAnswerGiven}
              /> :
              <WhatNext courseId={parseInt(this.props.params.id)}/>
          }
        </div>
      }</Loading>

      <Footer/>
    </main>
}

// state
import { deriveCurrentProblem } from './selectors';
const mapStateToProps = (state) => {
  const pageState = state.pages.Page_courses_id_review;
  return {
    currentProblem: deriveCurrentProblem(pageState),
    speGetPage:       pageState.speGetPage,

    ...pageState.speGetPage.status === 'success' &&
      {
        statusOfSolving:  pageState.statusOfSolving,
        amountOfProblems: pageState.speGetPage.payload.problems.length
      }
  };
};

// dispatch
import { Page_courses_id_review_Actions as pageActions } from './reducer';
const mapDispatchToProps = (dispatch, ownProps) => ({
  getPage: (courseId) => dispatch(
    pageActions.getPage(courseId, ownProps.route.simulated)
  ),
  enterPressed: () => {
    ownProps.ifReviewIsSimulated ?
      dispatch(pageActions.enterPressedInSimulatedReview()) :
      dispatch(pageActions.enterPressed());
  },
  separateAnswerSelfScoreGiven: (selfScore) =>
    dispatch({
      type: 'SEPARATE_ANSWER_SELF_SCORE_GIVEN',
      payload: selfScore
    }),
  onRightAnswerGiven: () => dispatch({ type: 'INLINED_ANSWER_GIVEN' })
});

import { connect } from 'react-redux';
Page_courses_id_review = connect(mapStateToProps, mapDispatchToProps)(Page_courses_id_review);

export { Page_courses_id_review };
