import api from '~/api';
import orFalse from '~/services/orFalse';
import MyDuck from '~/ducks/MyDuck';

import StandardTooltip from '~/components/StandardTooltip';

import css from './index.scss';

class FlashcardStatus extends React.Component {
  static propTypes = {
    courseId: PropTypes.number.isRequired,
    problemId: PropTypes.number.isRequired,
    puil: orFalse(PropTypes.object),
    removePuil: PropTypes.func.isRequired,
    MyActions: PropTypes.object.isRequired
  }

  state = {
    speUnignore: {}
  }

  apiUnignore = () => {
    if (this.state.speUnignore.status === 'request') return;

    api.post.ProblemUserIsLearningApi.unlearnUnignoreProblem(
      (speUnignore) => this.setState({ speUnignore }),
      { id: this.props.puil.id }
    )
      .then(() => {
        this.props.MyActions.unlearnUnignoreProblem(this.props.courseId, this.props.problemId);
        this.props.removePuil(this.props.problemId);
      });
  }

  renderCircle = (modifier, tooltipEl, tooltipProps) =>
    <section className="flashcard-status">
      <StandardTooltip
        width={130}
        tooltipEl={tooltipEl}
        tooltipProps={{ placement: 'right', ...tooltipProps }}
      >
        <div className={`${css.flashcardStatus} ${modifier}`}/>
      </StandardTooltip>
    </section>

  renderIgnoredTooltip = () =>
    <div className="flashcard-status-tooltip">
      <div className="text">This flashcard is ignored</div>
      <button
        type="button"
        className="button unignore-button"
        onClick={this.apiUnignore}
        disabled={this.state.speUnignore.status === 'request'}
      >
        {this.state.speUnignore.status === 'request' ? 'Unignoring...' : 'Unignore'}
      </button>
    </div>

  render = () => {
    const puil = this.props.puil;

    if (puil === false) {
      return this.renderCircle('-yet-to-learn', 'This flashcard is not yet learned');
    } else if (puil && puil.ifIgnored === true) {
      return this.renderCircle('-ignored', this.renderIgnoredTooltip(), { interactive: true });
    } else {
      return null;
    }
  }
}

export default connect(
  null,
  (dispatch) => ({
    MyActions: dispatch(MyDuck.getActions)
  })
)(FlashcardStatus);
