import humanizePostgresInterval from '~/services/humanizePostgresInterval';

import { ReadonlyEditor } from '~/components/ReadonlyEditor';

class CourseDescriptionAndStats extends React.Component {
  static propTypes = {
    course: PropTypes.object.isRequired,
    stats: PropTypes.object.isRequired,
    amountOfProblemsToReview: PropTypes.number.isRequired,
    nextDueDateIn: PropTypes.object,
    courseUserIsLearning: PropTypes.object
  }

  renderStat = (icon, stat) =>
    <li>
      <div className="icon">{icon}</div>
      <div className="stat">{stat}</div>
    </li>

  render = () =>
    <section className="course-description-and-stats">
      <ul className="course-stats">
        {this.renderStat(
          <i className="fa fa-users"/>,
          <div><span className="number">{this.props.stats.amountOfUsersLearningThisCourse}</span> students</div>
        )}
        {this.renderStat(
          <i className="fa fa-list"/>,
          <div><span className="number">{this.props.stats.amountOfProblems}</span> flashcards</div>
        )}
        {
          this.props.course.ifPublic ?
            this.renderStat(<i className="fa fa-eye"/>, 'Public') :
            this.renderStat(<i className="fa fa-eye-slash"/>, 'Private')
        }
        {
          this.props.courseUserIsLearning &&
          this.props.courseUserIsLearning.active &&
          this.props.nextDueDateIn &&
          this.renderStat(
            <i className="fa fa-hourglass-start"/>,
            (this.props.amountOfProblemsToReview > 0 ?
            'Review now!' :
            <div>
              Review in
              <span className="number">
                {' ' + humanizePostgresInterval(this.props.nextDueDateIn)}
              </span>
            </div>)
          )
        }
      </ul>
      <ReadonlyEditor
        className="course-description"
        html={this.props.course.description}
      />
    </section>
}

export { CourseDescriptionAndStats };
