import React from 'react';

import { Header }  from '~/components/Header';
import { Loading } from '~/components/Loading';
import { CourseActions } from '~/components/CourseActions';
import { ProblemBeingSolved } from './components/ProblemBeingSolved';
import { WhatNext } from './components/WhatNext';

import * as CourseUserIsLearningApi from '~/api/CourseUserIsLearning';
import { commonFetch } from '~/api/commonFetch';
import { calculateScore, amountOfAnswerInputsInProblem } from './service';

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
    params: React.PropTypes.shape({
      id: React.PropTypes.string
    }).isRequired,
    succumb: React.PropTypes.func.isRequired,
    solve:   React.PropTypes.func.isRequired,
    statusOfSolvingCurrentProblem: React.PropTypes.oneOf([
      'solving', 'succumbed',
      'solving', 'checkedAnswer'
    ]).isRequired,
    changeAmountOfProblemsToReviewBy: React.PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      speGetPage: {},
      currentProblemIndex: 0,
      amountOfRightAnswersGivenForCurrentProblem: 0,
      selfRating: 5
    };
  }

  componentDidMount = () => {
    commonFetch(
      (spe) => this.setState({ speGetPage: spe }),
      'GET', `/api/pages/courses/${this.props.params.id}/review`
    )
      .then(() => {
        document.addEventListener('keydown', this.onEnter, false);
      });
  }

  componentWillUnmount = () => {
    document.removeEventListener('keydown', this.onEnter);
  }

  onEnter = (event) => {
    if (event.keyCode !== 13) return;
    this.nextOrSuccumb();
  }

  onRightAnswerGivenFn = () => {
    this.setState({
      amountOfRightAnswersGivenForCurrentProblem: this.state.amountOfRightAnswersGivenForCurrentProblem + 1
    });
  }

  nextOrSuccumb = () => {
    this.ifOnEnterNextProblem() ?
      this.goToNextProblem() :
      this.props.succumb();
  }

  currentScore = () => {
    switch (this.currentProblem().type) {
      case 'inlinedAnswer': {
        const wanted = amountOfAnswerInputsInProblem(this.currentProblem());
        const given = this.state.amountOfRightAnswersGivenForCurrentProblem;
        return calculateScore(given, wanted);
      }
      case 'separateAnswer': return this.state.selfRating;
    }
  }

  ifOnEnterNextProblem = () => {
    if (!this.currentProblem()) return false;

    switch (this.currentProblem().type) {
      case 'inlinedAnswer': {
        const ifAnsweredAll = this.currentScore() === 5;
        const ifSuccumbed = this.props.statusOfSolvingCurrentProblem === 'succumbed';

        return ifSuccumbed || ifAnsweredAll;
      }
      case 'separateAnswer': {
        const ifCheckedTheRightAnswer = false;
        return ifCheckedTheRightAnswer;
      }
    }
  }

  // given: amount of answers that were properly given
  // wanted: amount of all problems
  recordScore = () => {
    CourseUserIsLearningApi.reviewProblem(
      () => {},
      this.state.speGetPage.payload.courseUserIsLearning.id,
      this.currentProblem().id,
      this.currentScore()
    );
  }

  goToNextProblem = () => {
    this.recordScore();
    this.props.changeAmountOfProblemsToReviewBy(-1);

    const nextProblemIndex = this.state.currentProblemIndex + 1;
    const isThereNextProblem = !!this.state.speGetPage.payload.problems[nextProblemIndex];

    if (isThereNextProblem) {
      this.clearCurrentProblem(nextProblemIndex);
    } else {
      this.setState({ currentProblemIndex: -1 });
    }
  }

  clearCurrentProblem = (nextProblemIndex) => {
    this.props.solve();
    this.setState({
      currentProblemIndex: nextProblemIndex,
      amountOfRightAnswersGivenForCurrentProblem: 0
    });
  }

  currentProblem = () =>
    this.state.speGetPage.payload.problems[this.state.currentProblemIndex]

  render = () =>
    <main className={css.main}>
      <Header/>

      <Loading spe={this.state.speGetPage}>{({ problems }) =>
        <div className="container">
          <CourseActions courseId={this.props.params.id} ifCuilActivityButtonsAreDisplayed={false}/>

          {
            problems[this.state.currentProblemIndex] === undefined ?
              <WhatNext/> :
              <ProblemBeingSolved
                key={this.state.currentProblemIndex} // is needed, otherwise Editor will just stay the same
                mode={this.state.statusOfSolvingCurrentProblem}
                problem={this.currentProblem()}
                onRightAnswerGivenFn={this.onRightAnswerGivenFn}
              />
          }

          {
            this.state.ifCheckedTheRightAnswer &&
            <section>
              Rate yourself! (0 - 5)
              {this.state.selfRating}
            </section>
          }

          {
            this.ifOnEnterNextProblem() &&
            <a className="button next" onClick={this.nextOrSuccumb}>
              NEXT
            </a>
          }
        </div>
      }</Loading>
    </main>
}

const mapStateToProps = (state) => ({
  statusOfSolvingCurrentProblem: state.pages.Page_courses_id_review.statusOfSolvingCurrentProblem
});
const mapDispatchToProps = dispatch => ({
  succumb: () => dispatch({ type: 'SUCCUMB' }),
  solve:   () => dispatch({ type: 'SOLVE' }),
  changeAmountOfProblemsToReviewBy: (by) => dispatch({
    type: 'CHANGE_AMOUNT_OF_PROBLEMS_TO_REVIEW_BY',
    payload: by
  })
});

import { connect } from 'react-redux';
Page_courses_id_review = connect(mapStateToProps, mapDispatchToProps)(Page_courses_id_review);

export { Page_courses_id_review };
