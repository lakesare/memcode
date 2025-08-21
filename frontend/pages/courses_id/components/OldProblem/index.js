import _ from 'lodash';
import api from '~/api';
import isProblemContentTheSame from '~/services/isProblemContentTheSame';

import { Draggable } from 'react-beautiful-dnd';

import Problem from '~/components/Problem';
import Checkbox from './components/Checkbox';
import DeleteFlashcardsModal from './components/DeleteFlashcardsModal';
import ExportFlashcardsModal from './components/ExportFlashcardsModal';
import switchType from '../services/switchType';

import css from './index.scss';

class OldProblem extends React.Component {
  static propTypes = {
    problem: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    updateOldProblem: PropTypes.func.isRequired,
    problems: PropTypes.array.isRequired,
    idsOfCheckedProblems: PropTypes.array.isRequired,
    updateIdsOfCheckedProblems: PropTypes.func.isRequired,
    uiRemoveOldProblems: PropTypes.func.isRequired,
    createdCoursesForSelect: PropTypes.array.isRequired,
    flashcardOrder: PropTypes.bool.isRequired,
    uiAddOptimisticProblem: PropTypes.func.isRequired,
    uiUpdateOptimisticProblemIntoOld: PropTypes.func.isRequired,
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
    api.ProblemApi.update(
      (spe) => this.setState({ speSave: spe }),
      {
        id: this.props.problem.id,
        problem: this.props.problem
      }
    )
      .then(() => {
        setTimeout(() => {
          this.setState({ problemInApi: this.props.problem, speSave: {} });
        }, 200);
      });
  }

  apiSwitchType = () => {
    const newType = this.props.problem.type == 'separateAnswer' ? 'inlinedAnswers' : 'separateAnswer';
    this.props.updateOldProblem({
      ...this.props.problem,
      content: switchType(this.props.problem.content, newType),
      type: newType
    });
    this.apiSave();
  }

  apiDuplicateFlashcard = () => {
    const optimisticId = _.uniqueId();

    const problemHash = {
      type:     this.props.problem.type,
      content:  this.props.problem.content,
      courseId: this.props.problem.courseId
    };
    this.props.uiAddOptimisticProblem({
      ...problemHash,
      _optimistic_id: optimisticId
    });

    api.ProblemApi.create(
      (spe) => this.setState({ speSave: spe }),
      { problem: problemHash }
    )
      .then((createdProblem) => {
        this.props.uiUpdateOptimisticProblemIntoOld(optimisticId, createdProblem);
      });
  }

  updateProblemContent = (problemContent) => {
    this.props.updateOldProblem({
      ...this.props.problem, content: problemContent
    });
  }

  ifNotOptimistic = () =>
    !this.props.problem._optimistic_id

  ifChecked = () =>
    this.props.idsOfCheckedProblems.includes(this.props.problem.id)

  ifLastChecked = () =>
    this.props.idsOfCheckedProblems[this.props.idsOfCheckedProblems.length - 1] === this.props.problem.id

  uiCheck = () => {
    if (!this.ifChecked()) {
      this.props.updateIdsOfCheckedProblems([...this.props.idsOfCheckedProblems, this.props.problem.id]);
    }
  }

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

  getCheckboxIndex = () => {
    return this.props.flashcardOrder ?
      this.props.problems.length - this.props.index - 1 :
      this.props.index;
  }

  isContentEmpty = () => {
    const content = this.props.problem.content;
    return !content.explanation && !content.answer && !content.content;
  }

  renderButtons = () =>
    <section className={`flashcard-buttons ${this.isContentEmpty() ? '-empty' : ''}`}>
      <div className="first">
        {/* <button className="button" style={{ background: 'rgb(58, 116, 205)' }}>Draft</button> */}

        <ExportFlashcardsModal
          toggler={<button type="button" tabIndex={-1} onClick={this.uiCheck} className="button export-button">Export</button>}
          uiRemoveOldProblems={this.props.uiRemoveOldProblems}
          idsOfCheckedProblems={this.props.idsOfCheckedProblems}
          createdCoursesForSelect={this.props.createdCoursesForSelect}
        />

        <DeleteFlashcardsModal
          toggler={<button type="button" tabIndex={-1} onClick={this.uiCheck} className="button delete-button">Delete</button>}
          uiRemoveOldProblems={this.props.uiRemoveOldProblems}
          idsOfCheckedProblems={this.props.idsOfCheckedProblems}
        />

        {
          this.props.idsOfCheckedProblems.length === 0 &&
          <button
            type="button"
            tabIndex={-1}
            className="button duplicate-button"
            onClick={this.apiDuplicateFlashcard}
          >Copy</button>
        }

        {
          this.props.idsOfCheckedProblems.length === 0 &&
          <button
            type="button"
            tabIndex={-1}
            className="button switch-type-button"
            onClick={this.apiSwitchType}
          >Type</button>
        }
      </div>

      {/* <div className="second"> */}
      {/*   <button className="button" style={{ background: 'rgb(29, 65, 104)' }}>Switch Type</button> */}
      {/*   <button className="button" style={{ background: 'rgb(143, 83, 138)' }}>Duplicate</button> */}
      {/*   <button className="button" style={{ background: 'rgb(42, 100, 76)' }}>Add New</button> */}
      {/* </div> */}
    </section>

  render = () => (
    this.ifNotOptimistic() ?
      <Draggable draggableId={this.props.problem.id} index={this.props.index}>{(provided) =>
        <div
          className={`old-problem-wrapper ${css['old-problem']} ${this.ifChecked() ? '-checked' : '-not-checked'} ${this.ifLastChecked() ? '-last-checked' : ''}`}
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
            index={this.getCheckboxIndex()}
            problems={this.props.problems}
            idsOfCheckedProblems={this.props.idsOfCheckedProblems}
            updateIdsOfCheckedProblems={this.props.updateIdsOfCheckedProblems}
            apiSave={this.apiSave}
            ifChecked={this.ifChecked()}
            dragHandleProps={provided.dragHandleProps}
          />

          {this.renderButtons()}

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

        <section className="checkbox">
          {this.getCheckboxIndex() + 1}
        </section>
      </div>
  )
}

export default OldProblem;
