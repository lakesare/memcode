import { orFalse } from '~/services/orFalse';
import api from '~/api';
import MyDuck from '~/ducks/MyDuck';

import Problem from '~/components/Problem';

@connect(
  () => ({}),
  (dispatch) => ({
    MyActions: dispatch(MyDuck.getActions)
  })
)
class ProblemWrapper extends React.Component {
  static propTypes = {
    problem: PropTypes.object.isRequired,
    puil: orFalse(PropTypes.object).isRequired,
    MyActions: PropTypes.object.isRequired
  }

  state = {
    puil: this.props.puil,
    speLearn: {},
    speIgnore: {},
    speDelete: {}
  }

  apiLearn = () => {
    this.props.MyActions.learnProblem(this.props.problem.courseId, this.props.problem.id);

    api.post.ProblemUserIsLearningApi.learnProblem(
      (spe) => this.setState({ speLearn: spe }),
      { problemId: this.props.problem.id }
    )
      .then((puil) => this.setState({ puil }));
  }

  apiIgnore = () => {
    this.props.MyActions.ignoreProblem(this.props.problem.courseId, this.props.problem.id);

    api.post.ProblemUserIsLearningApi.ignoreProblem(
      (spe) => this.setState({ speIgnore: spe }),
      { problemId: this.props.problem.id }
    )
      .then((puil) => { this.setState({ puil }); });
  }

  apiUnlearnUnignore = () => {
    this.props.MyActions.unlearnUnignoreProblem(this.props.problem.courseId, this.props.problem.id);

    api.post.ProblemUserIsLearningApi.unlearnUnignoreProblem(
      (spe) => this.setState({ speDelete: spe }),
      { id: this.state.puil.id }
    )
      .then(() => { this.setState({ puil: false }); });
  }

  renderProblem = () =>
    <Problem
      mode="show"
      problemContent={this.props.problem.content}
      problemType={this.props.problem.type}
    />

  renderButton = (className, onClick, text, { disabled = false } = {}) =>
    <div
      className={`button-wrapper ${className} ${disabled ? '-disabled' : ''}`}
      onClick={disabled ? () => {} : onClick}
    >
      <button className={`button ${className}`} type="button">
        {
          (className === '-unlearn' || className === '-unignore') &&
          <i className="fa fa-undo"/>
        }
        {text}
      </button>
    </div>

  render = () => {
    // pretend that request is already received right after we send it
    if (this.state.speLearn.status === 'request') {
      return <div className="problem-wrapper -learned">
        {this.renderButton('-unlearn', null, 'UNLEARN', { disabled: true })}
        {this.renderButton('-ignore', null, 'IGNORE', { disabled: true })}
        {this.renderProblem()}
      </div>;
    } else if (this.state.speIgnore.status === 'request') {
      return <div className="problem-wrapper -ignored">
        {this.renderButton('-learn', null, 'LEARN', { disabled: true })}
        {this.renderButton('-unignore', null, 'UNIGNORE', { disabled: true })}
        {this.renderProblem()}
      </div>;
    } else if (this.state.speDelete.status === 'request') {
      return <div className="problem-wrapper -yet-to-learn">
        {this.renderButton('-learn', null, 'LEARN', { disabled: true })}
        {this.renderButton('-ignore', null, 'IGNORE', { disabled: true })}
        {this.renderProblem()}
      </div>;
    }

    // render an actual response
    const puil = this.state.puil;
    if (puil === false) {
      return <div className="problem-wrapper -yet-to-learn">
        {this.renderButton('-learn', this.apiLearn, 'LEARN')}
        {this.renderButton('-ignore', this.apiIgnore, 'IGNORE')}
        {this.renderProblem()}
      </div>;
    } else if (puil && puil.ifIgnored === true) {
      return <div className="problem-wrapper -ignored">
        {this.renderButton('-learn', this.apiLearn, 'LEARN', { disabled: true })}
        {this.renderButton('-unignore', this.apiUnlearnUnignore, 'UNIGNORE')}
        {this.renderProblem()}
      </div>;
    } else if (puil) {
      return <div className="problem-wrapper -learned">
        {this.renderButton('-unlearn', this.apiUnlearnUnignore, 'UNLEARN')}
        {this.renderButton('-ignore', this.apiIgnore, 'IGNORE', { disabled: true })}
        {this.renderProblem()}
      </div>;
    }
  }
}

export { ProblemWrapper };
