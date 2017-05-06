import * as ProblemApi from '~/api/Problem';

import { Problem } from '~/components/Problem';
import { Actions } from './components/Actions';

import css from './index.css';

class OldProblem extends React.Component {
  static propTypes = {
    problem: PropTypes.object.isRequired,
    updateOldProblem: PropTypes.func.isRequired,
    removeOldProblem: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      speUpdateProblem: {},
      speDestroyProblem: {}
    };
  }

  save = (content) =>
    ProblemApi.update(
      (spe) => this.setState({ speUpdateProblem: spe }),
      this.props.problem.id,
      { content }
    )
      .then((updatedProblem) => {
        this.props.updateOldProblem(updatedProblem);
      });

  render = () =>
    <div className={css['old-problem']}>
      <Problem
        mode="editingOld"
        saveFn={this.save}
        problemContent={this.props.problem.content}
        problemType={this.props.problem.type}
      />

      <Actions removeOldProblem={this.props.removeOldProblem} problemId={this.props.problem.id}/>
    </div>
}

export { OldProblem };
