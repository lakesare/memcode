import $ from "jquery";
import * as ProblemApi from '~/api/Problem';
import { Problem } from '~/components/Problem';

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
    $(document).on('keydown', this.saveOnCTRLS);
  }

  componentWillUnmount = () => {
    $(document).off('keydown', this.saveOnCTRLS);
  }

  saveOnCTRLS = (event) => {
    if (event.ctrlKey && event.keyCode === 83) { // CTRL+S
      event.preventDefault();
      this.save();
    }
  }

  save = () => {
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
        <button className="button -blue" onClick={this.save}>SAVE</button>
      </section>

      <section className="choose-type">
        {this.renderTypeButton('separateAnswer', 'separate answer')}
        {this.renderTypeButton('inlinedAnswers', 'inlined answers')}
      </section>
    </div>
}

export { NewProblem };
