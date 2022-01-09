import Urls from '~/services/Urls';
import MyModel from '~/models/MyModel';

import { Link } from 'react-router-dom';

class CourseCard extends React.Component {
  static propTypes = {
    courseDto: PropTypes.shape({
      course: PropTypes.object.isRequired,
      amountOfProblemsToLearn: PropTypes.number.isRequired,
      amountOfProblemsToReview: PropTypes.number.isRequired,
      nextDueDate: PropTypes.string,
    }),
    pinned: PropTypes.bool,
    searchString: PropTypes.string
  }

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
    const title = this.props.courseDto.course.title;
    const searchString = this.props.searchString;

    if (this.props.pinned) {
      return <div className="title">{title}</div>;
    } else {
      return <div
        className="title"
        dangerouslySetInnerHTML={{
          __html: this.boldenTitle(title, searchString)
        }}
      />;
    }
  }

  render = () => {
    const courseDto = this.props.courseDto;
    if (this.props.pinned) {
      return (
        <div className="course-li -pinned">
          <Link className="title" to={Urls.courseShow(courseDto.course.id)}>
            {this.renderTitle()}
          </Link>
          {
            courseDto.amountOfProblemsToReview ?
              <Link className="action -review" to={Urls.courseReview(courseDto.course.id)}>
                {courseDto.amountOfProblemsToReview}
              </Link> :
              <div className="action -pinned">
                <i className="material-icons">push_pin</i>
              </div>
          }
        </div>
      );
    } else if (courseDto.amountOfProblemsToReview) {
      return (
        <div className="course-li -review">
          <Link className="title" to={Urls.courseReview(courseDto.course.id)}>
            {this.renderTitle()}
            <div className="action">{courseDto.amountOfProblemsToReview}</div>
          </Link>
        </div>
      );
    } else if (courseDto.amountOfProblemsToLearn) {
      return (
        <div className="course-li -learn">
          <Link className="title" to={Urls.courseLearn(courseDto.course.id)}>
            {this.renderTitle()}
            <div className="action">{courseDto.amountOfProblemsToLearn}</div>
          </Link>
        </div>
      );
    } else {
      const nextDueDateIn = MyModel.getNextDueDateIn(courseDto);
      if (!nextDueDateIn) return null;

      return (
        <div className="course-li -next-due-date-in">
          <Link className="title" to={Urls.courseShow(courseDto.course.id)}>
            {this.renderTitle()}
            <div className="action">
              {nextDueDateIn.amount} {nextDueDateIn.measure}
            </div>
          </Link>
        </div>
      );
    }
  }
}

export default CourseCard;
