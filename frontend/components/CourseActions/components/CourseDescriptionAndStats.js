import { ReadonlyEditor } from '~/components/ReadonlyEditor';

class CourseDescriptionAndStats extends React.Component {
  static propTypes = {
    course: PropTypes.object.isRequired,
    stats: PropTypes.object.isRequired
  }

  render = () =>
    <section className="course-description-and-stats">
      <ReadonlyEditor
        className="course-description"
        html={this.props.course.description}
      />
      <ul className="course-stats">
        <li>Users learning this course: {this.props.stats.amountOfUsersLearningThisCourse}</li>
        <li>Amount of flashcards: {this.props.stats.amountOfProblems}</li>
        <li>Public: {this.props.course.ifPublic ? 'yes' : 'no'}</li>
        {/* createdAt, add updatedAt */}
      </ul>
    </section>
}

export { CourseDescriptionAndStats };
