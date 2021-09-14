import Urls from '~/services/Urls';
import MyModel from '~/models/MyModel';

import { Link } from 'react-router-dom';

@connect((state) => ({
  currentUser: state.global.Authentication.currentUser
}))
class CourseCard extends React.Component {
  static propTypes = {
    courseDto: PropTypes.shape({
      course: PropTypes.object.isRequired,
      amountOfProblemsToLearn: PropTypes.number.isRequired,
      amountOfProblemsToReview: PropTypes.number.isRequired,
      nextDueDate: PropTypes.string,
      courseCategory: PropTypes.object,
      author: PropTypes.object
    })
  }

  renderTitle = () =>
    <div className="title">{this.props.courseDto.course.title}</div>

  render = () => {
    const courseDto = this.props.courseDto;
    if (courseDto.amountOfProblemsToReview) {
      return (
        <div className="course-li -review">
          <Link to={Urls.courseReview(courseDto.course.id)}>
            {this.renderTitle()}
            <div className="action">{courseDto.amountOfProblemsToReview}</div>
          </Link>
        </div>
      );
    } else if (courseDto.amountOfProblemsToLearn) {
      return (
        <div className="course-li -learn">
          <Link to={Urls.courseLearn(courseDto.course.id)}>
            {this.renderTitle()}
            <div className="action">{courseDto.amountOfProblemsToLearn}</div>
          </Link>
        </div>
      );
    } else {
      const nextDueDateIn = MyModel.getNextDueDateIn(courseDto);
      if (!nextDueDateIn) return null;
      return (
        <div className="course-li -learn">
          <Link to={Urls.courseShow(courseDto.course.id)}>
            {this.renderTitle()}
            <div className="action">
              {MyModel.nextDueDateInToString(nextDueDateIn)}
            </div>
          </Link>
        </div>
      );
    }
  }
}

export default CourseCard;
