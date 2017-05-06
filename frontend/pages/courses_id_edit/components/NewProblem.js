import { Problem } from '~/components/Problem';

import * as ProblemApi from '~/api/Problem';

class NewProblem extends React.Component {
  static propTypes = {
    courseId: PropTypes.string.isRequired,
    addNewProblem: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      speCreateProblem: {},
      key: this.randomKey(),
      currentProblemType: 'inlinedAnswers' // 'separateAnswer'
    };
  }

  save = (content) =>
    ProblemApi.create(
      (spe) => this.setState({ speCreateProblem: spe }),
      {
        content,
        type: this.state.currentProblemType,
        courseId: this.props.courseId
      }
    )
      .then((createdProblem) => {
        this.props.addNewProblem(createdProblem);
        this.setState({ key: this.randomKey() });
      });

  // :-D. yeaah. because Draft will keep the state otherwise, but we want our inputs cleared when we add a new problem.
  // alternative would be to keep state in this component, but I'm expicitly avoiding this.
  randomKey = () => Math.random(1) * 10000

  renderTypeButton = (type, typeInHuman) => {
    if (this.state.currentProblemType === type) {
      return <div className="button -black -active">
        {typeInHuman}
      </div>;
    } else {
      return <div
        className="button -black"
        onClick={() => this.setState({ currentProblemType: type })}
      >
        {typeInHuman}
      </div>;
    }
  }

  render = () =>
    <div className="new-problem">
      <Problem
        key={this.state.key}
        mode="editingNew"
        problemType={this.state.currentProblemType}
        saveFn={this.save}
      />

      <section className="how-to-create">
        CTRL+S to save a new task
      </section>

      <section className="choose-type">
        {this.renderTypeButton('inlinedAnswers', 'inlined answers')}
        {this.renderTypeButton('separateAnswer', 'separate answer')}
      </section>
    </div>
}

export { NewProblem };
