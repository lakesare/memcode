import { ProblemWithInlinedAnswers } from './components/ProblemWithInlinedAnswers';
import { ProblemWithSeparateAnswer } from './components/ProblemWithSeparateAnswer';

import css from './index.css';

class Problem extends React.Component {
  static propTypes = {
    mode: PropTypes.oneOf([
      'viewing', 'solving', 'editing'
    ]).isRequired,
    problemType: PropTypes.string.isRequired,

    problemContent: PropTypes.object,
    updateProblemContent: PropTypes.func.isRequired
  }

  renderProblem = (type) => {
    const props = {
      problemContent: this.props.problemContent,
      updateProblemContent: this.props.updateProblemContent,
      mode: this.props.mode
    };
    switch (type) {
      case 'inlinedAnswers':
        return <ProblemWithInlinedAnswers {...props}/>;
      case 'separateAnswer':
        return <ProblemWithSeparateAnswer {...props}/>;
      default:
        throw new Error(`Problem type '${type}' doesn't exist.`);
    }
  }

  render = () =>
    <div className={css['problem-wrapper']}>
      {this.renderProblem(this.props.problemType)}
    </div>
}

export { Problem };
