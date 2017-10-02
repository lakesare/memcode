
import { Link } from 'react-router';

class Course extends React.Component {
  static propTypes = {
    currentUser: PropTypes.object,
    courseData: PropTypes.shape({
      course: PropTypes.object.isRequired,
      amountOfProblems: PropTypes.number.isRequired,

      amountOfProblemsToLearn: PropTypes.number,
      amountOfProblemsToReview: PropTypes.number,
      courseUserIsLearning: PropTypes.object,
      nextDueDateIn: PropTypes.object
    }).isRequired,
    searchString: PropTypes.string.isRequired
  }

  getEditOrShowUrl = () => {
    const course = this.props.courseData.course;
    const ifCanEdit = this.props.currentUser && this.props.currentUser.id === course.userId;
    return ifCanEdit ?
      `/courses/${course.id}/edit` :
      `/courses/${course.id}`;
  }

  boldenTitle = (title, searchString) => {
    // "hello", "ll" => 2
    const beginsToMatchAt = title.toLowerCase().indexOf(
      searchString.toLowerCase()
    );
    const endsToMatchAt = beginsToMatchAt + searchString.length;
    const boldenedString =
      title.slice(0, beginsToMatchAt) +
      '<mark>' +
      title.slice(beginsToMatchAt, endsToMatchAt) +
      '</mark>' +
      title.slice(endsToMatchAt);

    return boldenedString;
  }

  renderTitle = () => {
    const title = this.props.courseData.course.title;
    const searchString = this.props.searchString;
    return <div
      className="title"
      dangerouslySetInnerHTML={{
        __html: this.boldenTitle(title, searchString)
      }}
    />;
  }

  renderUserRelatioshipToCourse = () => {
    const cuil = this.props.courseData.courseUserIsLearning;
    const course = this.props.courseData.course;
    const currentUser = this.props.currentUser;
    let status;
    if (currentUser) {
      if (cuil && cuil.active === true) {
        status = 'learning';
      } else if (currentUser.id === course.userId) {
        status = 'created';
      } else if (cuil && cuil.active === false) {
        status = 'used to learn';
      } else {
        status = '';
      }
    } else {
      status = '';
    }
    return <div className="status">{status}</div>;
  }

  render = () =>
    <li>
      <Link to={this.getEditOrShowUrl()}>
        {this.renderTitle()}
        {this.renderUserRelatioshipToCourse()}
      </Link>
    </li>
}

export { Course };
