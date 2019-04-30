import { orFalse } from '~/services/orFalse';
import { shuffle } from 'lodash';
import { Link } from 'react-router-dom';

import css from './index.css';

// every time we go to the other page - reload it in the background.
// when we learn/review, delete/create a LEARNED COURSE problem - update this state.

// LEARN (5)
// REVIEW (12) - onClick goes to random course/:id/review
import { IdsOfProblemsToLearnAndReviewPerCourseActions } from '~/reducers/IdsOfProblemsToLearnAndReviewPerCourse';
@connect(
  (state) => ({
    idsOfProblemsToLearnAndReviewPerCourse: state.global.IdsOfProblemsToLearnAndReviewPerCourse
  }),
  (dispatch) => ({
    apiSync: (payload) => IdsOfProblemsToLearnAndReviewPerCourseActions.apiSync(dispatch, payload)
  })
)
class LearnReviewLinks extends React.Component {
  static propTypes = {
    currentUser: PropTypes.object,
    idsOfProblemsToLearnAndReviewPerCourse: orFalse(PropTypes.object).isRequired,
    apiSync: PropTypes.func.isRequired,
    dontLinkToLearnOrReview: PropTypes.string
  }

  static defaultProps = {
    idsOfProblemsToLearnAndReviewPerCourse: false
  }

  componentDidMount() {
    if (this.props.currentUser) this.props.apiSync();
  }

  deriveAmountOfProblems = (toLearnOrToReview) => {
    const response = this.props.idsOfProblemsToLearnAndReviewPerCourse;
    const courseIds = Object.keys(response);
    return courseIds.reduce((totalToLearn, courseId) => {
      const toLearnInThisCourse = response[courseId][toLearnOrToReview].length;
      return totalToLearn + toLearnInThisCourse;
    }, 0);
  }

  generateLink = (toLearnOrToReview) => {
    const response = this.props.idsOfProblemsToLearnAndReviewPerCourse;
    const courseIds = Object.keys(response);
    const linkableCourseIds =
      courseIds.filter((courseId) =>
        response[courseId][toLearnOrToReview].length > 0 &&
        courseId !== this.props.dontLinkToLearnOrReview
      );

    // if there are no other courser to learn/review except for the current one -
    // pass undefined to props.to, so that we stay at the same page
    if (linkableCourseIds.length === 0) {
      return `/courses/${this.props.dontLinkToLearnOrReview}/learn`;
    } else {
      const courseId = shuffle(linkableCourseIds)[0];

      switch (toLearnOrToReview) {
        case 'toLearn':
          return `/courses/${courseId}/learn`;
        case 'toReview':
          return `/courses/${courseId}/review`;
        default:
          throw new Error('Argument must be "toLearn" or "toReview"');
      }
    }
  }

  renderToLearnLink = () => {
    const amount = this.deriveAmountOfProblems('toLearn');
    if (amount > 0) {
      return <Link to={this.generateLink('toLearn')} className="-to-learn -nonzero">
        LEARN ({amount})
      </Link>;
    } else {
      return <a className="-to-learn -zero">
        LEARN (0)
      </a>;
    }
  }

  renderToReviewLink = () => {
    const amount = this.deriveAmountOfProblems('toReview');
    if (amount > 0) {
      return <Link to={this.generateLink('toReview')} className="-to-review -nonzero">
        REVIEW ({amount})
      </Link>;
    } else {
      return <a className="-to-review -zero">
        REVIEW (0)
      </a>;
    }
  }

  render = () => (
    this.props.idsOfProblemsToLearnAndReviewPerCourse ?
      <section className={`${css.section} learn-review-links`}>
        {this.renderToLearnLink()}
        {this.renderToReviewLink()}
      </section> :
      null
  )
}

export default LearnReviewLinks;
