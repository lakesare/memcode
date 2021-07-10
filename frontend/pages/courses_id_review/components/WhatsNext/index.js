import { orFalse } from '~/services/orFalse';
import MyModel from '~/models/MyModel';

import CourseCardLearnReview from '~/appComponents/CourseCardLearnReview';

import css from './index.css';

class WhatsNext extends React.Component {
  static propTypes = {
    courseId: PropTypes.number.isRequired,
    currentUser: orFalse(PropTypes.object).isRequired,
    ifDisplay: PropTypes.bool.isRequired,
    My: PropTypes.object.isRequired,
  }

  state = { speCourses: {} }

  componentDidMount() {
  }

  componentDidUpdate = (prevProps) => {
    if (prevProps.ifDisplay === false && this.props.ifDisplay === true) {
      this.uiFocusWithinOurSection();
    }
  }

  uiFocusWithinOurSection = () => {
    const title = document.querySelector('#focus-on-me');
    if (title) {
      title.focus();
    }
  }

  getNextDueDateIn = () => {
    const dto = this.props.My.courses.find((c) => c.course.id === this.props.courseId);
    // If we're not learning this course (maybe it's just a test drive)
    if (!dto) {
      return null;
    }
    return MyModel.nextDueDateInToString(MyModel.getNextDueDateIn(dto));
  }

  renderCourses = () => {
    const courseDtos = this.props.My.courses.map(MyModel.dtoToCourseCardProps);

    const toReview = MyModel.getDtosToReview(courseDtos);
    // Also from the same category is a sweet idea.
    toReview.sort((a, b) => {
      if (a.amountOfProblemsToReview < b.amountOfProblemsToReview) {
        return -1;
      } else if (a.amountOfProblemsToReview > b.amountOfProblemsToReview) {
        return 1;
      } else {
        return 0;
      }
    });

    const toLearn = MyModel.getDtosToLearn(courseDtos)
      .filter((courseDto) => !toReview.find((c) => c.course.id === courseDto.course.id));
    toLearn.sort((a, b) => {
      if (a.amountOfProblemsToLearn > b.amountOfProblemsToLearn) {
        return -1;
      } else if (a.amountOfProblemsToLearn < b.amountOfProblemsToLearn) {
        return 1;
      } else {
        return 0;
      }
    });

    const reviewNext = courseDtos
      .filter((courseDto) =>
        !(
          toReview.find((c) => c.course.id === courseDto.course.id) ||
          toLearn.find((c) => c.course.id === courseDto.course.id)
        )
      );
    MyModel.sortByHowMuchToDo(reviewNext);

    const dtos = [...toReview, ...toLearn, ...reviewNext].slice(0, 20);

    return dtos.map((courseDto) =>
      <CourseCardLearnReview key={courseDto.course.id} courseDto={courseDto}/>
    );
  }

  render = () =>
    <section className={`${css.section} container`} style={this.props.ifDisplay ? {} : { display: 'none' }}>
      <section className="congratulations">
        <h2>You successfully reviewed this course!</h2>

        {
          this.props.currentUser &&
          <div className="next-review-time">
            <i className="material-icons timer-icon">timer</i>
            Next review: {` `}
            <span>{this.getNextDueDateIn()}</span>
          </div>
        }

      </section>

      <section className="whats-next" id="focus-on-me" tabIndex={-1}>
        <h2>What's next?</h2>

        <div className="offered-courses list-of-courses">
          {this.renderCourses()}
        </div>
      </section>
      {/* <Loading spe={this.state.speCourses}>{(coursesData) => ( */}
      {/*   <section className="offered-courses list-of-courses"> */}
      {/*     {coursesData.map((courseData) => ( */}
      {/*       courseData._type === 'simpleCourse' ? */}
      {/*         <CourseCardSimple key={courseData.course.id} courseDto={courseData}/> : */}
      {/*         <CourseCardLearnReview key={courseData.course.id} courseDto={courseData}/> */}
      {/*     ))} */}
      {/*   </section> */}
      {/* )}</Loading> */}
    </section>
}

export default WhatsNext;
