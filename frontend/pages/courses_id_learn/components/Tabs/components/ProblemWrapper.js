import { orFalse } from '~/services/orFalse';
import api from '~/api';
import MyDuck from '~/ducks/MyDuck';

import Problem from '~/components/Problem';
import StandardTooltip from '~/components/StandardTooltip';

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

    const puil = this.state.puil;
    
    if (puil && puil.id) {
      // Problem is already learned, use ignoreAlreadyLearnedProblem API
      api.post.ProblemUserIsLearningApi.ignoreAlreadyLearnedProblem(
        (spe) => this.setState({ speIgnore: spe }),
        { 
          problemId: this.props.problem.id,
          cuilId: puil.courseUserIsLearningId 
        }
      )
        .then(() => { 
          // Update the local puil state to reflect the ignore
          this.setState({ 
            puil: { ...puil, ifIgnored: true } 
          }); 
        });
    } else {
      // Problem is not learned yet, use regular ignoreProblem API
      api.post.ProblemUserIsLearningApi.ignoreProblem(
        (spe) => this.setState({ speIgnore: spe }),
        { problemId: this.props.problem.id }
      )
        .then((puil) => { this.setState({ puil }); });
    }
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

  renderOptionsDropdown = () => {
    const puil = this.state.puil;
    const isDisabled = this.state.speIgnore.status === 'request' || this.state.speDelete.status === 'request';
    
    return (
      <div className="options-dropdown">
        {puil === false && (
          <div 
            className={`option ${isDisabled ? '-disabled' : ''}`}
            onClick={(e) => {
              e.stopPropagation(); // Prevent event bubbling
              if (!isDisabled) this.apiIgnore();
            }}
          >
            <i className="fa fa-eye-slash"/> Ignore
          </div>
        )}
        {puil && puil.ifIgnored === true && (
          <div 
            className={`option ${isDisabled ? '-disabled' : ''}`}
            onClick={(e) => {
              e.stopPropagation(); // Prevent event bubbling
              if (!isDisabled) this.apiUnlearnUnignore();
            }}
          >
            <i className="fa fa-undo"/> Unignore
          </div>
        )}
        {puil && puil.ifIgnored !== true && (
          <>
            <div 
              className={`option ${isDisabled ? '-disabled' : ''}`}
              onClick={(e) => {
                e.stopPropagation(); // Prevent event bubbling
                if (!isDisabled) this.apiIgnore();
              }}
            >
              <i className="fa fa-eye-slash"/> Ignore
            </div>
            <div 
              className={`option ${isDisabled ? '-disabled' : ''}`}
              onClick={(e) => {
                e.stopPropagation(); // Prevent event bubbling
                if (!isDisabled) this.apiUnlearnUnignore();
              }}
            >
              <i className="fa fa-undo"/> Unlearn
            </div>
          </>
        )}
      </div>
    );
  }

  renderThreeDotsMenu = () => {
    const isDisabled = this.state.speIgnore.status === 'request' || this.state.speDelete.status === 'request';
    
    return (
      <StandardTooltip
        tooltipEl={this.renderOptionsDropdown()}
        tooltipProps={{
          className: 'problem-options-dropdown standard-tooltip -no-padding -dark',
          interactive: true,
          placement: 'bottom-end',
          trigger: 'mouseenter',
          arrow: false
        }}
        width={120}
      >
        <button 
          type="button" 
          className={`three-dots-menu ${isDisabled ? '-disabled' : ''}`}
          onClick={(e) => {
            e.stopPropagation(); // Prevent triggering learn action
          }}
        >
          <i className="fa fa-ellipsis-v"/>
        </button>
      </StandardTooltip>
    );
  }

  render = () => {
    const puil = this.state.puil;
    let wrapperClass = 'problem-wrapper';
    let onClickHandler = undefined;
    
    // Determine wrapper class and click handler based on state
    if (this.state.speLearn.status === 'request' || (puil && puil.ifIgnored !== true)) {
      wrapperClass += ' -learned';
      // Make learned flashcards clickable to unlearn them
      if (puil && puil.ifIgnored !== true) {
        onClickHandler = this.apiUnlearnUnignore;
      }
    } else if (this.state.speIgnore.status === 'request' || (puil && puil.ifIgnored === true)) {
      wrapperClass += ' -ignored';
    } else {
      wrapperClass += ' -yet-to-learn';
      // Unlearned flashcards are clickable to learn them
      onClickHandler = this.apiLearn;
    }
    
    return (
      <div className={wrapperClass} onClick={onClickHandler}>
        {this.renderThreeDotsMenu()}
        {this.renderProblem()}
      </div>
    );
  }
}

export { ProblemWrapper };
