import orFalse from '~/services/orFalse';
import MyModel from '~/models/MyModel';

import ReadonlyEditor from '~/components/ReadonlyEditor';
import StatsModal from '../components/StatsModal';
import api from '~/api';

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
      (
        nextDueDateIn === 'now' ?
          'Review now!' :
          <>
            Review in
            <span className="number review-in-stat-number">
              {nextDueDateIn.amount}
              <span className="measure">{nextDueDateIn.measure}</span>
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
                <a className="-fade-out-on-hover">
                  <span className="number">{this.props.courseDto.learners.length}</span> students
                </a>
              }
              course={this.props.courseDto.course}
              currentUser={this.props.currentUser}
              author={this.props.courseDto.author}
            />
          )}

          {this.renderStat(
            <i className="fa fa-list"/>,
            <div><span className="number">{this.props.courseDto.amountOfProblems}</span> flashcards</div>
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
