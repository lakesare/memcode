import { IdsOfProblemsToLearnAndReviewPerCourseActions } from '~/reducers/IdsOfProblemsToLearnAndReviewPerCourse';
import * as CourseUserIsLearningApi from '~/api/CourseUserIsLearning';

import { Problem } from '~/components/Problem';

@connect(
  () => ({}),
  (dispatch) => ({
    idsOfProblemsToLearnAndReviewPerCourse_learnProblem: (problemId) => IdsOfProblemsToLearnAndReviewPerCourseActions.learnProblem(dispatch, problemId)
  })
)
class ListOfProblems extends React.Component {
  static propTypes = {
    problems: PropTypes.array.isRequired,
    courseUserIsLearningId: PropTypes.number.isRequired,
    idsOfProblemsToLearnAndReviewPerCourse_learnProblem: PropTypes.func.isRequired
  }

  state = {
    idsOfLearnedProblems: []
  }

  apiLearn = (problemId) => {
    CourseUserIsLearningApi.learnProblem(
      () => {},
      this.props.courseUserIsLearningId, problemId
    );
    this.markProblemAsLearned(problemId);
    this.props.idsOfProblemsToLearnAndReviewPerCourse_learnProblem(problemId);
  }

  markProblemAsLearned = (problemId) =>
    this.setState({
      idsOfLearnedProblems: [...this.state.idsOfLearnedProblems, problemId]
    })

  ifProblemIsLearned = (problemId) =>
    this.state.idsOfLearnedProblems.includes(problemId)

  renderProblem = (problem) => {
    const ifLearned = this.ifProblemIsLearned(problem.id);
    return <div
      key={problem.id}
      className={"problem-wrapper " + ifLearned ? "-learned" : ""}
      onClick={() => ifLearned && this.apiLearn(problem.id)}
    >
      <Problem
        mode="show"
        problemContent={problem.content}
        problemType={problem.type}
      />
    </div>;
  }

  render = () =>
    <section className="problems">
      {this.props.problems.map(this.renderProblem)}
    </section>
}

export { ListOfProblems };
