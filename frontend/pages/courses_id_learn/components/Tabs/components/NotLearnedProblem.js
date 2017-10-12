import * as ProblemUserIsLearningApi from '~/api/ProblemUserIsLearning';

// import { Loading } from '~/components/Loading';
import { Problem } from '~/components/Problem';

class NotLearnedProblem extends React.Component {
  static propTypes = {
    problem: PropTypes.object.isRequired
  }

  state = {
  }

  apiLearn = () =>
    ProblemUserIsLearningApi.learn(false, this.props.problem.id)

  apiIgnore = () =>
    ProblemUserIsLearningApi.ignore(false, this.props.problem.id)

  render = () =>
    <div className="problem-wrapper">
      <button onClick={this.apiLearn}>LEARN</button>
      <Problem
        mode="show"
        problemContent={this.props.problem.content}
        problemType={this.props.problem.type}
      />
      <button onClick={this.apiIgnore}>IGNORE</button>
    </div>
}

export { NotLearnedProblem };
