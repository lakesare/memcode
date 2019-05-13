import { ProblemWrapper } from './ProblemWrapper';

class TabContent extends React.Component {
  static propTypes = {
    currentTab: PropTypes.string.isRequired,
    problems: PropTypes.array.isRequired,
    puils: PropTypes.array.isRequired
  }

  deriveFilteredProblems = () => {
    const problems = this.props.problems;
    const puils = this.props.puils;
    switch (this.props.currentTab) {
      case 'notLearned':
        return problems.filter((problem) =>
          !puils.find((puil) => puil.problemId === problem.id)
        );
      case 'ignored':
        return problems.filter((problem) =>
          puils.find((puil) =>
            puil.problemId === problem.id &&
            puil.ifIgnored === true
          )
        );
      case 'learned':
        return problems.filter((problem) =>
          puils.find((puil) =>
            puil.problemId === problem.id &&
            puil.ifIgnored === false
          )
        );
      default:
        throw new Error(`No such tab name: ${this.props.currentTab}.`);
    }
  }

  render = () =>
    <section className="tab-content container">
      {this.deriveFilteredProblems().map((problem) =>
        <ProblemWrapper
          key={problem.id}
          problem={problem}
          puil={this.props.puils.find((puil) => puil.problemId === problem.id) || false}
        />
      )}
    </section>
}

export { TabContent };
