import { SeparateAnswerShow } from './components/SeparateAnswerShow';
import { SeparateAnswerEdit } from './components/SeparateAnswerEdit';
import { SeparateAnswerReview } from './components/SeparateAnswerReview';

import { InlinedAnswersShow } from './components/InlinedAnswersShow';
import { InlinedAnswersEdit } from './components/InlinedAnswersEdit';
import { InlinedAnswersReview } from './components/InlinedAnswersReview';

class Problem extends React.Component {
  static propTypes = {
    problemType: PropTypes.string.isRequired,
    mode: PropTypes.string.isRequired,
    // Only useful for 'mode: edit'
    ifWithPlaceholder: PropTypes.bool
  }

  render = () => {
    switch (this.props.problemType) {
      case 'separateAnswer':
        switch (this.props.mode) {
          case 'show': return <SeparateAnswerShow {...this.props}/>;
          case 'edit': return <SeparateAnswerEdit {...this.props}/>;
          case 'review': return <SeparateAnswerReview {...this.props}/>;
          default:
            throw new Error(`mode can't be '${this.props.mode}'`);
        }
      case 'inlinedAnswers':
        switch (this.props.mode) {
          case 'show': return <InlinedAnswersShow {...this.props}/>;
          case 'edit': return <InlinedAnswersEdit {...this.props}/>;
          case 'review': return <InlinedAnswersReview {...this.props}/>;
          default:
            throw new Error(`mode can't be '${this.props.mode}'`);
        }
      default:
        throw new Error(`problem.type can't be '${this.props.problemType}'`);
    }
  }
}

export { Problem };
export default Problem;
