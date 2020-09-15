import { orFalse } from '~/services/orFalse';
import * as createSpe from '~/services/spe';
import CourseApi from '~/api/CourseApi';
import MyModel from '~/models/MyModel';

import Loading from '~/components/Loading';
import CourseCardLearnReview from '~/appComponents/CourseCardLearnReview';
import CourseCardSimple from '~/appComponents/CourseCardSimple';

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
    // this.apiGetCourses();
  }

  componentDidUpdate = (prevProps) => {
    if (prevProps.courseId !== this.props.courseId) {
      // this.apiGetCourses();
    }

    if (prevProps.ifDisplay === false && this.props.ifDisplay === true) {
      this.uiFocusOnFirstCourseCard();
    }
  }

  // Let's get apiGetPopularCourses popular courses, but only if we don't have any other own courses.
  // First of all, let's render 20 courses of ours, starting from the least-flashcards-to-review.
  apiGetCourses = () => {
    this.setState({ speCourses: createSpe.request() });
    Promise.all([
      this.apiGetPopularCourses(),
      (this.props.currentUser ? this.apiGetOwnCourses() : [])
    ]).then(([popularCourses, ownCourses]) => {
      const filteredOwnCourses = ownCourses.filter(({ course }) => course.id !== this.props.courseId);

      // um, 8 actually
      const numberOfCoursesToShow = 20;

      let finalCourses = filteredOwnCourses
        .slice(0, amountOfCoursesToShow)
        .map((courseData) => ({ ...courseData, _type: 'learnReviewCourse' }));

      if (finalCourses.length < amountOfCoursesToShow) {
        const filteredPopularCourses = popularCourses
          .onePageOfCourses
          .filter(({ course }) =>
            (course.id !== this.props.courseId) &&
            // ignore those courses which are already in filteredOwnCourses
            !filteredOwnCourses.find((ownCourseData) => ownCourseData.course.id === course.id)
          );
        const neededAmountOfCourses = amountOfCoursesToShow - finalCourses.length;

        finalCourses = [
          ...finalCourses,
          ...filteredPopularCourses
            .slice(0, neededAmountOfCourses)
            .map((courseData) => ({ ...courseData, _type: 'simpleCourse' }))
        ];
      }
      this.setState({ speCourses: createSpe.success(finalCourses) });
    // does this even work? I'd think it doesn't.
    }).catch((error) => {
      this.setState({ speCourses: createSpe.failure(error) });
    });
  }

  uiFocusOnFirstCourseCard = () => {
    // first <a/>, can be either an entire course card, or a.go link within
    const courseCard = document.querySelector('.offered-courses a');
    if (courseCard) {
      courseCard.focus();
    }
  }

  apiGetOwnCourses = () =>
    CourseApi.selectAllLearned(false)

  apiGetPopularCourses = () =>
    CourseApi.selectPublic(
      false,
      {
        pageSize: 21,
        pageNumber: 1,
        sortBy: 'popular'
      }
    )

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

      <section className="whats-next">
        <h2>What's next?</h2>

        <div className="offered-courses">
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
