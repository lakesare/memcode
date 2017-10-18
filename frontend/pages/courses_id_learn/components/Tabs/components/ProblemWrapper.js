import { orFalse } from '~/services/orFalse';
import * as ProblemUserIsLearningApi from '~/api/ProblemUserIsLearning';

import { Problem } from '~/components/Problem';


// TODO okay, looks like it was a bad idea to be naming these actions as eg createProblem, we should.../
import { IdsOfProblemsToLearnAndReviewPerCourseActions } from '~/reducers/IdsOfProblemsToLearnAndReviewPerCourse';
@connect(
  () => ({}),
  (dispatch) => ({
    IdsOfProblemsToLearnAndReviewPerCourseActions: {
      createProblem: (courseId, problemId) => IdsOfProblemsToLearnAndReviewPerCourseActions.createProblem(dispatch, courseId, problemId),
      deleteProblem: (problemId) =>
        IdsOfProblemsToLearnAndReviewPerCourseActions.deleteProblem(dispatch, problemId),
      learnProblem: (problemId) =>
        IdsOfProblemsToLearnAndReviewPerCourseActions.learnProblem(dispatch, problemId),
      apiSync: () =>
        IdsOfProblemsToLearnAndReviewPerCourseActions.apiSync(dispatch)
    }
  })
)
class ProblemWrapper extends React.Component {
  static propTypes = {
    problem: PropTypes.object.isRequired,
    puil: orFalse(PropTypes.object).isRequired,
    IdsOfProblemsToLearnAndReviewPerCourseActions: PropTypes.shape({
      createProblem: PropTypes.func.isRequired,
      deleteProblem: PropTypes.func.isRequired,
      learnProblem: PropTypes.func.isRequired,
      apiSync: PropTypes.func.isRequired
    }).isRequired
  }

  state = {
    puil: this.props.puil
  }

  apiLearn = () =>
    ProblemUserIsLearningApi.create(false, this.props.problem.id)
      .then((puil) => this.setState({ puil }))
      .then(() => this.props.IdsOfProblemsToLearnAndReviewPerCourseActions.learnProblem(this.props.problem.id))

  apiIgnore = async () => {
    let ignoredPuil;
    if (this.state.puil) {
      ignoredPuil = await ProblemUserIsLearningApi.ignore(false, this.state.puil.id);
    } else if (this.state.puil === false) {
      const puil = await ProblemUserIsLearningApi.create(false, this.props.problem.id);
      ignoredPuil = await ProblemUserIsLearningApi.ignore(false, puil.id);
    }

    this.setState({ puil: ignoredPuil });
    this.props.IdsOfProblemsToLearnAndReviewPerCourseActions.deleteProblem(this.props.problem.id);
  }

  // == unignore, unlearn
  apiDelete = () =>
    ProblemUserIsLearningApi.ddelete(false, this.state.puil.id)
      .then(() => this.setState({ puil: false }))
      .then(this.props.IdsOfProblemsToLearnAndReviewPerCourseActions.apiSync)

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
      <button className={className} type="button">
        {
          (className === '-unlearn' || className === '-unignore') &&
          <i className="fa fa-undo"/>
        }
        {text}
      </button>
    </div>

  render = () => {
    const puil = this.state.puil;
    if (puil && puil.ifIgnored === true) {
      return <div className="problem-wrapper -ignored">
        {this.renderButton('-learn', this.apiLearn, 'LEARN', { disabled: true })}
        {this.renderProblem()}
        {this.renderButton('-unignore', this.apiDelete, 'UNIGNORE')}
      </div>;
    } else if (puil) {
      return <div className="problem-wrapper -learned">
        {this.renderButton('-unlearn', this.apiDelete, 'UNLEARN')}
        {this.renderProblem()}
        {this.renderButton('-ignore', this.apiIgnore, 'IGNORE', { disabled: true })}
      </div>;
    } else if (puil === false) {
      return <div className="problem-wrapper -yet-to-learn">
        {this.renderButton('-learn', this.apiLearn, 'LEARN')}
        {this.renderProblem()}
        {this.renderButton('-ignore', this.apiIgnore, 'IGNORE')}
      </div>;
    }
  }
}

export { ProblemWrapper };
