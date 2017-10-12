// import { IdsOfProblemsToLearnAndReviewPerCourseActions } from '~/reducers/IdsOfProblemsToLearnAndReviewPerCourse';

import { NotLearnedProblem } from './components/NotLearnedProblems';

// @connect(
//   () => ({}),
//   (dispatch) => ({
//     idsOfProblemsToLearnAndReviewPerCourse_learnProblem: (problemId) => IdsOfProblemsToLearnAndReviewPerCourseActions.learnProblem(dispatch, problemId)
//   })
// )
class NotLearnedProblems extends React.Component {
  static propTypes = {
    courseId: PropTypes.string.isRequired,
    cuilId: PropTypes.string.isRequired,
    problemResponses: PropTypes.array.isRequired
  }

  state = {
  }

  renderProblem = (problemResponse) => {
    const problem = problemResponse.problem;
    const puil = problemResponse.problemUserIsLearning;
    if (puil && puil.ifIgnored === true) {
      // return <IgnoredProblem problem={problem} puil={puil}/>;
      return null;
    } else if (puil) {
      // return <LearnedProblem problem={problem} puil={puil}/>;
      return null;
    } else if (puil === null) {
      return <NotLearnedProblem problem={problem}/>;
    }
  }

  render = () =>
    <section className="problems">
      {this.props.problemResponses.map(this.renderProblem)}
    </section>
}

export { NotLearnedProblems };
