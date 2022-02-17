import orFalse from '~/services/orFalse';
import MyModel from '~/models/MyModel';

import ReadonlyEditor from '~/components/ReadonlyEditor';
import CourseStarRating from './CourseStarRating';
import StatsModal from '../components/StatsModal';
import api from '~/api';

class CourseDescriptionAndStats extends React.Component {
  static propTypes = {
    currentUser: orFalse(PropTypes.object).isRequired,
    courseDto: PropTypes.object.isRequired,
    ifWithDescriptionPlaceholder: PropTypes.bool.isRequired,
    My: PropTypes.object.isRequired
  }

  state = {
    stats: []
  }

  componentDidMount() {
    this.getStats();
  }

  getStats = () =>
    api.CourseApi.getStudentsStats(
      (spe) => spe.status === 'success',
      { courseId: this.props.courseDto.course.id, authorId: this.props.courseDto.author.id }
    )
    .then((payload) => {
      this.setState({ stats: [] })
      const merged_learners = []

      for (let index = 0; index < payload.length; index++) {
        const element = payload[index];
        const merged = { ...this.props.courseDto.learners[index], ...element };
        merged_learners.push(merged)
        this.setState({ stats: merged_learners })
      }
    })

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
                <button type="button" className="button students-stats-button">
                  <span className="number"> {this.props.courseDto.learners.length} </span>  
                   students 
                </button>
              }
              course={this.props.courseDto.course}
              stats={this.state.stats}
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
