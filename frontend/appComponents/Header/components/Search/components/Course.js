import stripTags from '~/services/stripTags';
import Urls from '~/services/Urls';

import { Link } from 'react-router-dom';

class Course extends React.Component {
  static propTypes = {
    currentUser: PropTypes.object,
    courseData: PropTypes.shape({
      course: PropTypes.object.isRequired,
      amountOfProblems: PropTypes.string.isRequired,
      amountOfUsersLearningThisCourse: PropTypes.string.isRequired,
      authorUsername: PropTypes.string.isRequired,
      courseCategoryName: PropTypes.string.isRequired,
      ifUserIsLearning: PropTypes.bool.isRequired
    }).isRequired,
    searchString: PropTypes.string.isRequired,
    uiCloseDropdown: PropTypes.func.isRequired
  }

  getEditOrShowUrl = () =>
    Urls.courseShow(this.props.courseData.course.id)

  boldenTitle = (title, searchString) => {
    // "hello", "ll" => 2
    const beginsToMatchAt = title.toLowerCase().indexOf(
      searchString.toLowerCase()
    );
    const endsToMatchAt = beginsToMatchAt + searchString.length;

    // was match in a description instead of in a title?
    // don't bolden anything, return the string as it is
    if (beginsToMatchAt === -1) {
      return title;
    }

    const boldenedTitle =
      title.slice(0, beginsToMatchAt) +
      '<mark>' +
      title.slice(beginsToMatchAt, endsToMatchAt) +
      '</mark>' +
      title.slice(endsToMatchAt);

    return boldenedTitle;
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

  renderDescription = () => {
    const description = stripTags(this.props.courseData.course.description);
    const searchString = this.props.searchString;
    return <div
      className="description"
      dangerouslySetInnerHTML={{
        __html: this.boldenTitle(description, searchString)
      }}
    />;
  }

  renderUserRelatioshipToCourse = () =>
    <div className="status">
      {
        this.props.currentUser &&
        this.props.courseData.ifUserIsLearning &&
        <i className="fa fa-graduation-cap"/>
      }
    </div>

  renderCourseStats = () =>
    <div className="course-stats">
      <div className="course-category-name">In {this.props.courseData.courseCategoryName} |</div>
      <div className="author">By {this.props.courseData.authorUsername} |</div>
      <div className="amount-of-students">
        <i className="fa fa-users"/>
        {this.props.courseData.amountOfUsersLearningThisCourse}
      </div>
    </div>

  render = () =>
    <li onClick={this.props.uiCloseDropdown}>
      <Link to={this.getEditOrShowUrl()}>
        <div className="title_and_description">
          {this.renderTitle()}
          {this.renderDescription()}
        </div>
        {this.renderUserRelatioshipToCourse()}
        {this.renderCourseStats()}
      </Link>
    </li>
}

export { Course };
