import { orFalse } from '~/services/orFalse';
import { shuffle } from 'lodash';
import { Link } from 'react-router-dom';

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
    idsOfProblemsToLearnAndReviewPerCourse: orFalse(PropTypes.object).isRequired,
    apiSync: PropTypes.func.isRequired,
    dontLinkToLearnOrReview: PropTypes.string
  }

  static defaultProps = {
    idsOfProblemsToLearnAndReviewPerCourse: false
  }

  componentDidMount() {
    this.props.apiSync();
  }

  //   componentDidUpdate() {
  //     this.props.apiSync();
  //   }

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
    // stay on the same page
    if (linkableCourseIds.length === 0) {
      return window.location.pathname;
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
      return <Link to={this.generateLink('toLearn')} className="button -to-learn">
        LEARN ({amount})
      </Link>;
    } else {
      return null;
    }
  }

  renderToReviewLink = () => {
    const amount = this.deriveAmountOfProblems('toReview');
    if (amount > 0) {
      return <Link to={this.generateLink('toReview')} className="button -to-review">
        REVIEW ({amount})
      </Link>;
    } else {
      return null;
    }
  }

  render = () => (
    this.props.idsOfProblemsToLearnAndReviewPerCourse &&
    <section className="learn-review-links">
      {this.renderToLearnLink()}
      {this.renderToReviewLink()}
    </section>
  )
}

export default LearnReviewLinks;
