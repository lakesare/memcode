import * as ProblemApi from '~/api/Problem';
import * as speCreator from '~/services/spe';
import { Problem } from '~/components/Problem';
import { Loading } from '~/components/Loading';

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
    courseId: PropTypes.string.isRequired,
    addNewProblem: PropTypes.func.isRequired
  }

  state = {
    speCreateProblem: {},
    currentProblemType: 'separateAnswer',
    problemContent: createEmptyEditorState('separateAnswer')
  }

  componentDidMount = () => {
    document.addEventListener('keydown', this.saveOnCTRLS, false);
  }

  componentWillUnmount = () => {
    document.removeEventListener('keydown', this.saveOnCTRLS, false);
  }

  saveOnCTRLS = (event) => {
    // metaKey catches cmd in mac, ctrlKey catches ctrl in ubuntas
    if ((event.ctrlKey || event.metaKey) && event.keyCode === 83) { // CTRL+S
      event.preventDefault();
      this.apiSave();
    }
  }

  uiValidate = () => {
    const type = this.state.currentProblemType;
    const problemContent = this.state.problemContent;
    let error = '';
    if (type === 'separateAnswer') {
      if (!problemContent.content) {
        error = "Please add the question (you'll be asked it when you review the flashcard).";
      } else if (!problemContent.answer) {
        error = "Please add the answer to the question.";
      }
    } else if (type === 'inlinedAnswers') {
      if (!problemContent.content) {
        error = "Please add some sentence with a word that you'll need to fill in on review (select words you'd like to fill in, and press Mark As Answer).";
      }
    }
    if (error) {
      this.setState({ speCreateProblem: speCreator.failure(error) });
      return false;
    } else {
      return true;
    }
  }

  apiSave = () => {
    if (this.uiValidate()) {
      const type = this.state.currentProblemType;
      ProblemApi.create(
        (spe) => this.setState({ speCreateProblem: spe }),
        {
          content: this.state.problemContent,
          type,
          courseId: this.props.courseId
        }
      )
        .then((createdProblem) => {
          this.props.addNewProblem(createdProblem);
          this.setState({
            problemContent: createEmptyEditorState(this.state.currentProblemType)
          });
        });
    }
  }

  updateProblemContent = (problemContent) =>
    this.setState({ problemContent })

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

  renderTypeButton = (type, typeInHuman) => {
    if (this.state.currentProblemType === type) {
      return <div
        className="button -black -active"
      >{typeInHuman}</div>;
    } else {
      return <div
        className="button -black"
        onClick={() => this.updateType(type)}
      >{typeInHuman}</div>;
    }
  }

  render = () =>
    <div className="new-problem">
      <Problem
        mode="edit"
        problemContent={this.state.problemContent}
        updateProblemContent={this.updateProblemContent}
        problemType={this.state.currentProblemType}
        ifNewProblem
      />

      <section className="how-to-create">
        <span>CTRL+S to save a new flashcard</span>
        <button className="button -pink" onClick={this.apiSave}>SAVE</button>
      </section>

      <Loading enabledStatuses={['failure']} spe={this.state.speCreateProblem}/>

      <section className="choose-type">
        {this.renderTypeButton('separateAnswer', 'question answer')}
        {this.renderTypeButton('inlinedAnswers', 'fill-in answer')}
      </section>
    </div>
}

export { NewProblem };
