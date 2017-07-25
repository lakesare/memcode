import * as ProblemApi from '~/api/Problem';

import { ProblemWithSeparateAnswer_edit } from '~/components/ProblemWithSeparateAnswer/Edit';
import { Actions } from './components/Actions';

import css from './index.css';

class OldProblem extends React.Component {
  static propTypes = {
    problem: PropTypes.object.isRequired,
    updateOldProblem: PropTypes.func.isRequired,
    removeOldProblem: PropTypes.func.isRequired
  }

  state = {
    speUpdateProblem: {},
    speDestroyProblem: {},
  }

  apiUpdate = () =>
    ProblemApi.update(
      (spe) => this.setState({ speUpdateProblem: spe }),
      this.props.problem.id,
      {
        content: toApi(this.props.problem.content, this.props.problem.type)
      }
    ).then(this.props.updateOldProblem)

  updateProblemContent = (problemContent) =>
    this.props.updateOldProblem({
      ...this.props.problem, content: problemContent
    })

  render = () =>
    <div className={css['old-problem']}>
      <ProblemWithSeparateAnswer_edit
        problemContent={this.props.problem.content}
        updateProblemContent={this.updateProblemContent}
      />

      <Actions removeOldProblem={this.props.removeOldProblem} problemId={this.props.problem.id}/>
    </div>
}

export { OldProblem };
