import React from 'react';

import { browserHistory } from 'react-router';

import { Header }  from '~/components/Header';
import { Loading } from '~/components/Loading';

import { ProblemBeingSolved } from './components/ProblemBeingSolved';

import * as CourseUserIsLearningApi from '~/api/CourseUserIsLearning';
import { commonFetch } from '~/api/commonFetch';


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
    statusOfSolvingCurrentProblem: React.PropTypes.oneOf(['solving', 'succumbedAfterSolving']).isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      speGetPage: {},
      currentProblemIndex: 0,
      amountOfRightAnswersGivenForCurrentProblem: 0
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

    const wanted = this.amountOfAnswerInputsInProblem(this.currentProblem());
    const given = this.state.amountOfRightAnswersGivenForCurrentProblem;

    // not all answers are given! render answered problem.
    if (given < wanted) {
      // if already succumbed and looked through the answers
      if (this.props.statusOfSolvingCurrentProblem === 'succumbedAfterSolving') {
        this.recordScore(given, wanted);
        this.goToNextProblem();
      } else {
        this.props.succumb();
      }
    } else {
      this.recordScore(given, wanted);
      this.goToNextProblem();
    }
  }

  onRightAnswerGivenFn = () => {
    this.setState({
      amountOfRightAnswersGivenForCurrentProblem: this.state.amountOfRightAnswersGivenForCurrentProblem + 1
    });
  }

  // given: amount of answers that were properly given
  // wanted: amount of all problems
  recordScore = (given, wanted) => {
    CourseUserIsLearningApi.reviewProblem(
      () => {},
      this.state.speGetPage.payload.courseUserIsLearning.id,
      this.currentProblem().id,
      this.calculateScore(given, wanted)
    );
  }

  goToNextProblem = () => {
    const nextProblemIndex = this.state.currentProblemIndex + 1;
    const isThereNextProblem = !!this.state.speGetPage.payload.problems[nextProblemIndex];

    if (isThereNextProblem) {
      this.props.solve();
      this.setState({
        currentProblemIndex: nextProblemIndex,
        amountOfRightAnswersGivenForCurrentProblem: 0
      });
    } else {
      browserHistory.push('/courses');
    }
  }

  currentProblem = () =>
    this.state.speGetPage.payload.problems[this.state.currentProblemIndex]

  // to problem model?
  calculateScore = (given, wanted) => {
    if (given === wanted) {
      return 5;
    } else { // given < wanted
      return (given / wanted) * 5; // 0..5
    }
  }

  // to problem model?
  amountOfAnswerInputsInProblem = (problem) => {
    const entities = problem.content.entityMap;
    const answerEntities = Object.keys(entities)
      .filter((key) => entities[key].type === 'answer');
    return answerEntities.length;
  }

  render = () =>
    <main className={css.main}>
      <Header/>

      <div className="container">
        <Loading spe={this.state.speGetPage}>{({ course }) =>
          <div>
            <h1 className="course-title">{course.title}</h1>

            <ProblemBeingSolved
              key={this.state.currentProblemIndex} // is needed, otherwise Editor will just stay the same
              mode={this.state.statusOfSolvingCurrentProblem}
              problem={this.currentProblem()}
              onRightAnswerGivenFn={this.onRightAnswerGivenFn}
            />
          </div>
        }</Loading>
      </div>
    </main>
}

const mapDispatchToProps = dispatch => ({
  succumb: () => dispatch({ type: 'SUCCUMB' }),
  solve:   () => dispatch({ type: 'SOLVE' })
});
const mapStateToProps = (state) => ({
  statusOfSolvingCurrentProblem: state.page_courses_id_review.statusOfSolvingCurrentProblem
});

import { connect } from 'react-redux';
Page_courses_id_review = connect(mapStateToProps, mapDispatchToProps)(Page_courses_id_review);

export { Page_courses_id_review };
