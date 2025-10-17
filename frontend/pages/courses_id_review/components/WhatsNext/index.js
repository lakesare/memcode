import { orFalse } from '~/services/orFalse';
import MyModel from '~/models/MyModel';
import SettingsDuck from '~/ducks/SettingsDuck';

import CourseCardLearnReview from '~/appComponents/CourseCardLearnReview';

import css from './index.scss';

// import GitHubButton from 'react-github-btn';

@connect(
  (state) => ({
    Settings: state.global.Settings
  }),
  (dispatch) => ({
    SettingsActions: SettingsDuck.getActions(dispatch)
  })
)
class WhatsNext extends React.Component {
  static propTypes = {
    courseId: PropTypes.number.isRequired,
    currentUser: orFalse(PropTypes.object).isRequired,
    ifDisplay: PropTypes.bool.isRequired,
    My: PropTypes.object.isRequired,
    Settings: PropTypes.object.isRequired,
    SettingsActions: PropTypes.object.isRequired
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
    let courseDtos = this.props.My.courses.map(MyModel.dtoToCourseCardProps);

    if (this.props.Settings.focusedCategoryId) {
      courseDtos = MyModel.filterCoursesByFocusMode(courseDtos, this.props.Settings.focusedCategoryId);
    }

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

  //   clickedOnSocial = (name) => {
  //     if (name === 'github') {
  //       localStorage.setItem('clickedOnGithub', true)
  //       this.setState({ clickedOnGithub: true })
  //     } else if (name === 'patreon') {
  //       localStorage.setItem
  //     }
  //   }

  render = () =>
    <section className={`${css.section} container`} style={this.props.ifDisplay ? {} : { display: 'none' }}>
      <section className="congratulations">
        <h2>You successfully reviewed this course!</h2>

        {
          this.props.currentUser &&
          this.getNextDueDateIn() &&
          <div className="next-review-time">
            <i className="material-icons timer-icon">timer</i>
            Next review: {` `}
            <span>{this.getNextDueDateIn()}</span>
          </div>
        }
      </section>


      <div className="social-buttons">
        <a target="_blank" rel="noopener noreferrer" href="https://github.com/lakesare/memcode" className="github social button -move-up-on-hover">
          <i className="fa fa-github"/>
          <div className="text">Star us on Github</div>
        </a>

        {/* <a target="_blank" rel="noopener noreferrer" href="https://twitter.com/memcodeapp" className="twitter social button -move-up-on-hover"> */}
        {/*   <i className="fa fa-twitter"/> */}
        {/*   <div className="text">Follow on Twitter</div> */}
        {/* </a> */}

        <a target="_blank" rel="noopener noreferrer" href="https://www.patreon.com/memcode" className="patreon social button -move-up-on-hover">
          <svg viewBox="0 0 24 24">
            <path fill="currentColor" d="M14.82 2.41C18.78 2.41 22 5.65 22 9.62C22 13.58 18.78 16.8 14.82 16.8C10.85 16.8 7.61 13.58 7.61 9.62C7.61 5.65 10.85 2.41 14.82 2.41M2 21.6H5.5V2.41H2V21.6Z" />
          </svg>
          <div className="text">Support us on Patreon</div>
        </a>
      </div>


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
