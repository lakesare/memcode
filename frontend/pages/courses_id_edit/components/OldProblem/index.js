import _ from 'lodash';
import ProblemApi from '~/api/Problem';
import isProblemContentTheSame from '~/services/isProblemContentTheSame';

import { Draggable } from 'react-beautiful-dnd';

import Problem from '~/components/Problem';
import { Checkbox } from './components/Checkbox';

import css from './index.css';

class OldProblem extends React.Component {
  static propTypes = {
    problem: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    updateOldProblem: PropTypes.func.isRequired,
    problems: PropTypes.array.isRequired,
    idsOfCheckedProblems: PropTypes.array.isRequired,
    updateIdsOfCheckedProblems: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.uniqueId = _.uniqueId('OldProblem_');
  }

  state = {
    speSave: {},
    mode: 'show',
    problemInApi: this.props.problem,
    firstFocus: false,
    secondFocus: false
  }

  // Change the mode to 'edit'
  componentDidMount = () => {
    setTimeout(() => {
      this.setState({ mode: 'edit' });
    }, 500);
    document.addEventListener('keydown', this.saveOnCmdS, false);
  }

  componentWillUnmount = () => {
    document.removeEventListener('keydown', this.saveOnCmdS, false);
  }

  saveOnCmdS = (event) => {
    // CTRL+S
    // metaKey catches cmd in mac, ctrlKey catches ctrl in ubuntas
    const cmdS = (event.ctrlKey || event.metaKey) && event.keyCode === 83;
    const esc = event.key === 'Escape';

    if (cmdS || esc) {
      event.preventDefault();
      if (this.ifFocusedInEditor()) {
        document.activeElement.blur();
        if (this.didProblemContentChange()) {
          event.preventDefault();
          this.apiSave();
        }
      }
    }
  }

  didProblemContentChange = () => {
    return !isProblemContentTheSame(this.state.problemInApi, this.props.problem);
  }

  apiSave = () => {
    ProblemApi.update(
      (spe) => this.setState({ speSave: spe }),
      this.props.problem.id,
      this.props.problem
    )
      .then(() => {
        setTimeout(() => {
          this.setState({ problemInApi: this.props.problem, speSave: {} });
        }, 200);
      });
  }

  updateProblemContent = (problemContent) => {
    this.props.updateOldProblem({
      ...this.props.problem, content: problemContent
    });
  }

  ifOptimistic = () =>
    !this.props.problem._optimistic_id

  ifChecked = () =>
    this.props.idsOfCheckedProblems.includes(this.props.problem.id)

  onFocusChange = () => {
    if (!this.ifFocusedInEditor()) {
      this.apiSave();
    }
  }

  ifFocusedInEditor = () => {
    if (!document.activeElement) return false;
    const wrapperEl = document.querySelector('#' + this.uniqueId);
    const focusingInThisEditor = wrapperEl && wrapperEl.contains(document.activeElement);
    return focusingInThisEditor;
  }

  render = () => (
    this.ifOptimistic() ?
      <Draggable draggableId={this.props.problem.id} index={this.props.index}>{(provided) =>
        <div
          className={`old-problem-wrapper ${css['old-problem']} ${this.ifChecked() ? '-checked' : '-not-checked'}`}
          id={this.uniqueId}
          ref={provided.innerRef}
          {...provided.draggableProps}
          style={provided.draggableProps.style}
        >
          <Problem
            mode={this.state.mode}
            problemContent={this.props.problem.content}
            updateProblemContent={this.updateProblemContent}
            problemType={this.props.problem.type}
            onFocusChange={this.onFocusChange}
          />

          <Checkbox
            id={this.props.problem.id}
            index={this.props.index}
            problems={this.props.problems}
            idsOfCheckedProblems={this.props.idsOfCheckedProblems}
            updateIdsOfCheckedProblems={this.props.updateIdsOfCheckedProblems}
            speSave={this.state.speSave}
            ifChecked={this.ifChecked()}
            dragHandleProps={provided.dragHandleProps}
          />

          <section className="save-changes">
            {
              this.didProblemContentChange() &&
              <>
                <button
                  className={`button save-changes-button ${this.state.speSave.status === 'request' ? '-saving' : ''} ${this.state.speSave.status === 'success' ? '-just-saved' : ''}`}
                  type="button"
                  onClick={this.apiSave}
                  tabIndex={-1}
                >
                  {this.state.speSave.status === 'success' ? 'SAVED' : 'SAVE'}
                </button>

                <div className="shortcut">
                  ⌘ + S
                </div>
              </>
            }
          </section>
        </div>
      }</Draggable> :
      <div className={`old-problem-wrapper ${css['old-problem']}`}>
        <Problem
          mode="show"
          problemContent={this.props.problem.content}
          problemType={this.props.problem.type}
        />
      </div>
  )
}

export { OldProblem };
