import { shuffle } from 'lodash';
import { Link } from 'react-router-dom';

import MyModel from '~/models/MyModel';

@connect(
  (state) => ({
    My: state.global.My
  })
)
class LearnReviewLinks extends React.Component {
  static propTypes = {
    My: PropTypes.object.isRequired,
    // apiSync: PropTypes.func.isRequired,
    dontLinkToLearnOrReview: PropTypes.string
  }

  generateLink = (courses, toLearnOrToReview) => {
    const linkableCourseIds = courses
      .map((c) => c.course.id)
      .filter((courseId) =>
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
    const dtosToLearn = MyModel.getDtosToLearn(this.props.My.courses);
    const amountOfProblems = MyModel.countAllProblemsToLearn(dtosToLearn);

    return dtosToLearn.length > 0 ?
      <Link to={this.generateLink(dtosToLearn, 'toLearn')} className="button -to-learn">
        LEARN ({amountOfProblems})
      </Link> :
      null;
  }

  renderToReviewLink = () => {
    const dtosToReview = MyModel.getDtosToReview(this.props.My.courses);
    const amountOfProblems = MyModel.countAllProblemsToReview(dtosToReview);

    if (dtosToReview.length > 0) {
      return <Link to={this.generateLink(dtosToReview, 'toReview')} className="button -to-review">
        REVIEW ({amountOfProblems})
      </Link>;
    } else {
      return null;
    }
  }

  render = () => (
    <section className="learn-review-links">
      {this.renderToLearnLink()}
      {this.renderToReviewLink()}
    </section>
  )
}

export default LearnReviewLinks;
