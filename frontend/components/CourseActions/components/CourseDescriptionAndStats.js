import orFalse from '~/services/orFalse';
import humanizePostgresInterval from '~/services/humanizePostgresInterval';

import ReadonlyEditor from '~/components/ReadonlyEditor';
import CourseStarRating from './CourseStarRating';

class CourseDescriptionAndStats extends React.Component {
  static propTypes = {
    currentUser: orFalse(PropTypes.object).isRequired,
    courseDto: PropTypes.object.isRequired,
    ifWithDescriptionPlaceholder: PropTypes.bool.isRequired
  }

  ifCanRateCourse = () => (
    this.props.currentUser &&
    this.props.courseDto.course.userId !== this.props.currentUser.id
  )

  ifAuthor = () => (
    this.props.currentUser &&
    this.props.courseDto.course.userId === this.props.currentUser.id
  )

  getCourseDescription = () => {
    const description = this.props.courseDto.course.description;
    if (this.props.ifWithDescriptionPlaceholder && this.ifAuthor() && !description) {
      return '<div class="placeholder">Click [edit] to add some description to your course ♥</div>';
    }
    return description;
  }

  renderStat = (icon, stat) =>
    <li>
      <div className="stat">{stat}</div>
      <div className="icon">{icon}</div>
    </li>

  renderReviewInStat = () => {
    const [amount, measure] = humanizePostgresInterval(this.props.courseDto.nextDueDateIn, { asArray: true, canBeNegative: true });
    return this.renderStat(
      <i className="fa fa-hourglass-start"/>,
      (
        amount < 0 ?
          'Review now!' :
          <>
            Review in
            <span className="number review-in-stat-number">
              {amount}
              <span className="measure">{measure}</span>
            </span>
          </>
      )
    );
  }

  render = () =>
    <section className="course-description-and-stats">
      <div className="container">
        <ReadonlyEditor
          className="course-description"
          html={this.getCourseDescription()}
        />

        {
          false &&
          <ul className="course-stats">
            {this.renderStat(
              <i className="fa fa-user"/>,
              <div>By Evgenia Karunus</div>
            )}
            {this.renderStat(
              <i className="fa fa-calendar"/>,
              <div>Last updated: 3 months ago</div>
            )}
            {
              this.props.courseDto.course.ifPublic ?
                this.renderStat(<i className="fa fa-eye"/>, 'Public') :
                this.renderStat(<i className="fa fa-eye-slash"/>, 'Private')
            }
          </ul>
        }

        <ul className="course-stats">
          {
            this.props.courseDto.courseUserIsLearning &&
            this.props.courseDto.courseUserIsLearning.active &&
            this.props.courseDto.nextDueDateIn &&
            this.renderReviewInStat()
          }

          {this.renderStat(
            <i className="fa fa-users"/>,
            <div><span className="number">{this.props.courseDto.learners.length}</span> students</div>
          )}

          {this.renderStat(
            <i className="fa fa-list"/>,
            <div><span className="number">{this.props.courseDto.amountOfProblems}</span> flashcards</div>
          )}

          <CourseStarRating
            courseId={this.props.courseDto.course.id}
            ifCanRateCourse={this.ifCanRateCourse()}
          />
        </ul>
      </div>
    </section>
}

export default CourseDescriptionAndStats;
