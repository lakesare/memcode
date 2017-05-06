import { ProblemWithInlinedAnswers } from './components/ProblemWithInlinedAnswers';
import { ProblemWithSeparateAnswer } from './components/ProblemWithSeparateAnswer';

import css from './index.css';

class Problem extends React.Component {
  static propTypes = {
    mode: PropTypes.oneOf([
      'viewing', 'solving', 'editingOld', 'editingNew'
    ]).isRequired,
    problemType: PropTypes.string.isRequired,

    problemContent: PropTypes.object,
    saveFn: PropTypes.func, // when 'editing'
  }

  renderProblem = (type) => {
    switch (type) {
      case 'inlinedAnswers':
        return <ProblemWithInlinedAnswers
          problemContent={this.props.problemContent}
          mode={this.props.mode}
          saveFn={this.props.saveFn}
        />;
      case 'separateAnswer':
        return <ProblemWithSeparateAnswer
          problemContent={this.props.problemContent}
          mode={this.props.mode}
          saveFn={this.props.saveFn}
        />;
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
