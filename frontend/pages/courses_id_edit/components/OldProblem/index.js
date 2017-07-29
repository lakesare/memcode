import { Problem } from '~/components/Problem';
import { Actions } from './components/Actions';

import css from './index.css';

class OldProblem extends React.Component {
  static propTypes = {
    problem: PropTypes.object.isRequired,
    updateOldProblem: PropTypes.func.isRequired,
    removeOldProblem: PropTypes.func.isRequired
  }

  updateProblemContent = (problemContent) =>
    this.props.updateOldProblem({
      ...this.props.problem, content: problemContent
    })

  render = () =>
    <div className={css['old-problem']}>
      <Problem
        mode="edit"
        problemContent={this.props.problem.content}
        updateProblemContent={this.updateProblemContent}
        problemType={this.props.problem.type}
      />

      <Actions removeOldProblem={this.props.removeOldProblem} problemId={this.props.problem.id}/>
    </div>
}

export { OldProblem };
