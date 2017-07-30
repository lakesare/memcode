import * as ProblemApi from '~/api/Problem';

import { Loading } from '~/components/Loading';
import { Problem } from '~/components/Problem';
import { Actions } from './components/Actions';

import css from './index.css';

class OldProblem extends React.Component {
  static propTypes = {
    problem: PropTypes.object.isRequired,
    updateOldProblem: PropTypes.func.isRequired,
    removeOldProblem: PropTypes.func.isRequired
  }

  state = { speSave: {} }

  save = () =>
    ProblemApi.update(
      (spe) => this.setState({ speSave: spe }),
      this.props.problem.id,
      this.props.problem
    )

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
        apiSave={this.save}
      />

      <Actions speSave={this.state.speSave} removeOldProblem={this.props.removeOldProblem} problemId={this.props.problem.id}/>

      <Loading spe={this.state.speSave}/>
    </div>
}

export { OldProblem };
