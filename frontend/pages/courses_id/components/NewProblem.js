import _ from 'lodash';

import ProblemApi from '~/api/Problem';
import Problem from '~/components/Problem';
import Loading from '~/components/Loading';

const createEmptyEditorState = (type) => {
  switch (type) {
    case 'separateAnswer': {
      return { content: '', answer: '' };
    }
    case 'inlinedAnswers': {
      return { content: '', explanation: '' };
    }
  }
};

class NewProblem extends React.Component {
  static propTypes = {
    index: PropTypes.number,
    courseId: PropTypes.number.isRequired,
    uiAddOptimisticProblem: PropTypes.func.isRequired,
    uiUpdateOptimisticProblemIntoOld: PropTypes.func.isRequired
  }

  state = {
    speCreateProblem: {},
    currentProblemType: 'separateAnswer',
    problemContent: createEmptyEditorState('separateAnswer')
  }

  componentDidMount = () => {
    document.addEventListener('keydown', this.saveOnCmdS, false);
  }

  componentWillUnmount = () => {
    document.removeEventListener('keydown', this.saveOnCmdS, false);
  }

  saveOnCmdS = (event) => {
    // metaKey catches cmd in mac, ctrlKey catches ctrl in ubuntas
    // CTRL+S
    const cmdS = (event.ctrlKey || event.metaKey) && event.keyCode === 83;
    if (cmdS) {
      event.preventDefault();
      if (!this.ifFocusedOnSomeOldProblem()) {
        this.apiSave();

        // Refocus on the first editor
        const firstEditor = document.querySelector('.new-problem .ql-editor');
        firstEditor.focus();
      }
    }
  }

  ifFocusedOnSomeOldProblem = () => {
    if (!document.activeElement) return false;
    const focusingOnSomeOldProblem = document.activeElement.closest('.old-problem-wrapper');
    return focusingOnSomeOldProblem;
  }

  apiSave = () => {
    const optimisticId = _.uniqueId();
    const problemHash = {
      type:     this.state.currentProblemType,
      content:  this.state.problemContent,
      courseId: this.props.courseId
    };
    const optimisticProblem = {
      ...problemHash,
      _optimistic_id: optimisticId
    };
    this.props.uiAddOptimisticProblem(optimisticProblem);
    this.setState({
      problemContent: createEmptyEditorState(this.state.currentProblemType)
    });

    ProblemApi.create(
      (spe) => this.setState({ speCreateProblem: spe }),
      problemHash
    )
      .then((createdProblem) => {
        this.props.uiUpdateOptimisticProblemIntoOld(optimisticId, createdProblem);
      });
  }

  updateProblemContent = (problemContent) => {
    this.setState({ problemContent, speCreateProblem: {} });
  }

  updateType = (newType) => {
    const oldContent = this.state.problemContent;
    let newContent;

    if (newType === 'separateAnswer') {
      newContent = {
        content: oldContent.content,
        answer: oldContent.explanation
      };
    } else if (newType === 'inlinedAnswers') {
      newContent = {
        content: oldContent.content,
        explanation: oldContent.answer
      };
    }

    this.setState({
      currentProblemType: newType,
      problemContent: newContent
    });
  }

  renderTypeButton = (type, typeInHuman) =>
    <button
      type="button"
      className={`button ${this.state.currentProblemType === type ? '-active' : ''}`}
      onClick={() => this.state.currentProblemType !== type && this.updateType(type)}
      tabIndex={-1}
    >{typeInHuman}</button>

  render = () =>
    <div className="new-problem">
      {/* Looks better without the checkbox admittedly */}
      <section className="checkbox">
        {this.props.index}
      </section>

      <Problem
        mode="edit"
        ifWithPlaceholder
        problemContent={this.state.problemContent}
        updateProblemContent={this.updateProblemContent}
        problemType={this.state.currentProblemType}
      />

      <section className="how-to-create">
        <label>NEW FLASHCARD</label>
        <button
          type="button"
          className="button"
          onClick={this.apiSave}
          tabIndex={-1}
        >
          SAVE
          <div className="shortcut">⌘ + S</div>
        </button>
      </section>

      <Loading enabledStatuses={['failure']} spe={this.state.speCreateProblem}/>

      <section className="choose-type">
        <label>FLASHCARD TYPE</label>
        <div className="buttons">
          {this.renderTypeButton('separateAnswer', 'question answer')}
          {this.renderTypeButton('inlinedAnswers', 'fill-in answer')}
        </div>
      </section>
    </div>
}

export default NewProblem;
