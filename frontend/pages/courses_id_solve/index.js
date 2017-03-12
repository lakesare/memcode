import React from 'react';

import { Header }  from '~/components/Header';
import { Loading } from '~/components/Loading';

import { ProblemBeingSolved } from './components/ProblemBeingSolved';

import * as CourseApi from '~/api/Course';
import * as ProblemApi from '~/api/Problem';

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
class Page_courses_id_solve extends React.Component {
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
      speGetCourse: {},
      currentProblemIndex: 0,
      amountOfRightAnswersGivenForCurrentProblem: 0
    };
  }

  componentDidMount = () => {
    CourseApi.show(
      spe => this.setState({ speGetCourse: spe }),
      this.props.params.id
    )
      .then(() => {
        document.addEventListener('keydown', this.onEnter, false);
      });
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
        this.nextProblem();
      } else {
        this.props.succumb();
      }
    } else {
      this.recordScore(given, wanted);
      this.nextProblem();
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

    const score = {
      problemId: this.state.currentProblemIndex,
      score: this.calculateScore(given, wanted)
    };



  }

  calculateScore = (given, wanted) => {
    if (given === wanted) {
      return 1;
    } else { // given < wanted
      return given / wanted; // 0..1
    }
  }

  nextProblem = () => {
    this.props.solve();
    this.setState({
      currentProblemIndex: this.state.currentProblemIndex + 1,
      amountOfRightAnswersGivenForCurrentProblem: 0
    });
  }

  currentProblem = () =>
    this.state.speGetCourse.payload.problems[this.state.currentProblemIndex]

  amountOfAnswerInputsInProblem = (problem) => {
    const entities = problem.content.entityMap;
    const answerEntities = Object.keys(entities)
      .filter((key) => entities[key].type === 'answer');
    return answerEntities.length;
  }

  renderProblem = () => {
    const problem = this.currentProblem();

    return (
      <ProblemBeingSolved
        key={problem.id} // is needed, otherwise Editor will just stay the same
        mode={this.state.statusOfSolvingCurrentProblem}
        problem={problem}
        onRightAnswerGivenFn={this.onRightAnswerGivenFn}
      />
    );
  }

  render = () =>
    <main className={css.main}>
      <Header/>

      <div className="container">
        <Loading spe={this.state.speGetCourse}>{payload =>
          <div>
            <h1 className="course-title">{payload.course.title}</h1>

            {this.renderProblem()}
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
  statusOfSolvingCurrentProblem: state.page_courses_id_solve.statusOfSolvingCurrentProblem
});

import { connect } from 'react-redux';
Page_courses_id_solve = connect(mapStateToProps, mapDispatchToProps)(Page_courses_id_solve);

export { Page_courses_id_solve };
