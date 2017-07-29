import { ProblemWithSeparateAnswer_edit } from '~/components/ProblemWithSeparateAnswer/Edit';
import { ProblemWithSeparateAnswer_show } from '~/components/ProblemWithSeparateAnswer/Show';
import { ProblemWithSeparateAnswer_review } from '~/components/ProblemWithSeparateAnswer/Review';

class Problem extends React.Component {
  static propTypes = {
    problemType: PropTypes.string.isRequired,
    mode: PropTypes.string.isRequired
  }

  render = () => {
    switch (this.props.problemType) {
      case 'separateAnswer':
        switch (this.props.mode) {
          case 'show': return <ProblemWithSeparateAnswer_show {...this.props}/>;
          case 'edit': return <ProblemWithSeparateAnswer_edit {...this.props}/>;
          case 'review': return <ProblemWithSeparateAnswer_review {...this.props}/>;
          default:
            throw new Error(`mode can't be '${this.props.mode}'`);
        }
      default:
        throw new Error(`problem.type can't be '${this.props.problemType}'`);
    }
  }
}

export { Problem };
