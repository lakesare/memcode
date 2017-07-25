import { ProblemWithSeparateAnswer_edit } from '~/components/ProblemWithSeparateAnswer/Edit';

import * as ProblemApi from '~/api/Problem';


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

  save = () => {
    const type = this.state.currentProblemType;

    ProblemApi.create(
      (spe) => this.setState({ speCreateProblem: spe }),
      {
        content: toApi(this.state.problemContent, type),
        type,
        courseId: this.props.courseId
      }
    )
      .then((createdProblem) => {
        console.log('then');
        this.props.addNewProblem(createdProblem);
        this.setState({
          problemContent: createEmptyEditorState('separateAnswer')
        });
      });
  }

  updateProblemContent = (problemContent) => {
    this.setState({ problemContent });
  }

  updateType = (type) => {
    this.setState({
      currentProblemType: type,
      problemContent: undefined
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
      <ProblemWithSeparateAnswer_edit
        problemContent={this.state.problemContent}
        updateProblemContent={this.updateProblemContent}
      />

      <section className="how-to-create">
        <button onClick={this.save}>SAVVE</button>
        CTRL+S to save a new task
      </section>

      <section className="choose-type">
        {this.renderTypeButton('separateAnswer', 'separate answer')}
        {this.renderTypeButton('inlinedAnswers', 'inlined answers')}
      </section>
    </div>
}

export { NewProblem };
