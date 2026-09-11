import orFalse from '~/services/orFalse';
import pluralize from '~/services/pluralize';
import MyModel from '~/models/MyModel';

import ReadonlyEditor from '~/components/ReadonlyEditor';
import StatsModal from '../components/StatsModal';

class CourseDescriptionAndStats extends React.Component {
  static propTypes = {
    currentUser: orFalse(PropTypes.object).isRequired,
    courseDto: PropTypes.object.isRequired,
    ifWithDescriptionPlaceholder: PropTypes.bool.isRequired,
    My: PropTypes.object.isRequired
  }

  state = {}

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

  // lakesare:here
  renderReviewInStat = () => {
    const dto = this.props.My.courses.find((c) => c.course.id === this.props.courseDto.course.id);
    // If we're not learning this course (maybe it's just a test drive)
    if (!dto) {
      return null;
    }
    const nextDueDateIn = MyModel.getNextDueDateIn(dto);

    if (nextDueDateIn === null) {
      return null;
    }
    return this.renderStat(
      <i className="fa fa-hourglass-start"/>,
      <div className="stat-line">
        <span className="label">Review in</span>
        {/* [claude comment] "a few seconds" comes through with no amount of its own */}
        {nextDueDateIn.amount !== '' && <span className="number">{nextDueDateIn.amount}</span>}
        <span className="label">{nextDueDateIn.measure}</span>
      </div>
    );
  }

  render = () =>
    <section className="course-description-and-stats">
      <div className="container">
        <ReadonlyEditor
          className="course-description"
          html={this.getCourseDescription()}
        />

        <ul className="course-stats">
          {
            this.props.courseDto.courseUserIsLearning &&
            this.props.courseDto.courseUserIsLearning.active &&
            this.renderReviewInStat()
          }

          {this.renderStat(
            <i className="fa fa-users"/>,
            <StatsModal
              toggler={
                <a className="stat-line -fade-out-on-hover">
                  <span className="number">{this.props.courseDto.learners.length}</span>
                  <span className="label">{pluralize(this.props.courseDto.learners.length, 'student', 'students')}</span>
                </a>
              }
              course={this.props.courseDto.course}
              currentUser={this.props.currentUser}
              author={this.props.courseDto.author}
            />
          )}

          {this.renderStat(
            <i className="fa fa-list"/>,
            <div className="stat-line">
              <span className="number">{this.props.courseDto.amountOfProblems}</span>
              <span className="label">{pluralize(this.props.courseDto.amountOfProblems, 'flashcard', 'flashcards')}</span>
            </div>
          )}

          {/* <CourseStarRating */}
          {/*   courseId={this.props.courseDto.course.id} */}
          {/*   ifCanRateCourse={this.ifCanRateCourse()} */}
          {/* /> */}
        </ul>
      </div>
    </section>
}

export default CourseDescriptionAndStats;
