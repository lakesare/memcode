import { withRouter } from 'react-router-dom';

import StandardTooltip from '~/components/StandardTooltip';
import CourseCard from './components/CourseCard';

import MyModel from '~/models/MyModel';
import MyDuck from '~/ducks/MyDuck';

import css from './index.scss';

@withRouter
@connect(
  (state) => ({
    My: state.global.My,
    Settings: state.global.Settings
  }),
  (dispatch) => ({
    MyActions: dispatch(MyDuck.getActions)
  })
)
class CoursesDropdown extends React.Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    My: PropTypes.object.isRequired,
    Settings: PropTypes.object.isRequired,
    MyActions: PropTypes.object.isRequired
  }

  state = {
    searchString: '',
    isDropdownVisible: ''
  }

  componentDidMount = () => {
    document.addEventListener('keydown', this.uiHideDropdownOnEsc, false);
  }

  componentDidUpdate = (prevProps) => {
    if (prevProps.location.pathname !== this.props.location.pathname) {
      this.uiHideDropdown();
    }
  }

  componentWillUnmount = () => {
    document.removeEventListener('keydown', this.uiHideDropdownOnEsc, false);
  }

  uiHideDropdownOnEsc = (event) => {
    if (event.keyCode === 27) {
      this.uiHideDropdown();
    }
  }

  uiHideDropdown = () => {
    this.setState({ isDropdownVisible: false });
  }

  uiShowDropdown = () => {
    this.setState({ isDropdownVisible: true });
  }

  filterCoursesForSearchString = (dtos) =>
    dtos.filter((dto) =>
      dto.course.title.toLowerCase().includes(this.state.searchString.toLowerCase())
    )

  getCourseDtos = () => {
    let courseDtos = this.props.My.courses.map(MyModel.dtoToCourseCardProps);
    
    // Apply focus mode filter if active
    if (this.props.Settings.focusedCategoryId) {
      courseDtos = MyModel.filterCoursesByFocusMode(courseDtos, this.props.Settings.focusedCategoryId);
    }
    
    MyModel.sortByHowMuchToDo(courseDtos);
    return courseDtos;
  }

  getPinnedCourses = () => {
    let pinned = this.props.My.courses.filter((dto) =>
      this.props.Settings.pinnedCourseIds.includes(dto.course.id)
    );
    
    // Apply focus mode filter if active
    if (this.props.Settings.focusedCategoryId) {
      pinned = MyModel.filterCoursesByFocusMode(pinned, this.props.Settings.focusedCategoryId);
    }
    
    pinned = pinned
      .map(MyModel.dtoToCourseCardProps)
      .sort((a, b) => a.course.title.localeCompare(b.course.title));
    return pinned;
  }

  renderNoCourses = () =>
    <div className="not-learning-placeholder">
      You are not learning any courses at the moment.<br/>
      When you start learning some course, it will appear in this dropdown.
    </div>

  renderDropdown = () => {
    if (!this.props.My.coursesAlreadyFetched) {
      return <div>Loading courses...</div>;
    } else if (this.getCourseDtos().length === 0) {
      return this.renderNoCourses();
    } else {
      return <div className={css.tooltip}>
        <div className="pinned-courses">
          {this.getPinnedCourses().map((courseDto) =>
            <CourseCard
              key={courseDto.course.id}
              courseDto={courseDto}
              pinned
            />
          )}
        </div>

        <div className="search-courses">
          <input
            className="standard-input -TextInput"
            type="text"
            value={this.state.searchString}
            onChange={(e) => this.setState({ searchString: e.target.value })}
            autoComplete="off"
          />
          <button
            type="button"
            className={`button -white sync-button ${this.props.My.speCourses.status === 'request' ? '-saving' : ''} ${this.props.My.speCourses.status === 'success' ? '-just-saved' : ''}`}
            onClick={this.props.MyActions.apiGetCourses}
          >
            Sync
          </button>
        </div>

        <div className="all-courses">
          {this.filterCoursesForSearchString(this.getCourseDtos()).map((courseDto) =>
            <CourseCard
              key={courseDto.course.id}
              courseDto={courseDto}
              searchString={this.state.searchString}
            />
          )}
        </div>
      </div>;
    }
  }

  renderNOfProblemsToReview = () => {
    let courses = this.props.My.courses;
    
    // Apply focus mode filter if active
    if (this.props.Settings.focusedCategoryId) {
      courses = MyModel.filterCoursesByFocusMode(courses, this.props.Settings.focusedCategoryId);
    }
    
    const dtosToReview = MyModel.getDtosToReview(courses);
    const nOfProblems = MyModel.countAllProblemsToReview(dtosToReview);

    return <div className={`button total-n-to-review-button ${this.props.My.speCourses.status === 'request' ? '-loading' : '-not-loading'} ${this.props.My.speCourses.status === 'success' ? '-just-saved' : ''} ${nOfProblems === 0 ? '-zero' : ''}`}>
      {nOfProblems || ""}
    </div>;
  }

  render = () =>
    <StandardTooltip
      tooltipEl={this.renderDropdown()}
      tooltipProps={{
        className: 'standard-tooltip -no-padding -bright my-courses-dropdown',
        interactive: true,
        placement: 'bottom-end',
        // trigger: 'click',
        arrow: false,
        // plugins: [hideOnEsc],
        onShow: () => {
          // This is primarily for courses to renew!
          this.setState({ searchString: '' });
        },
        // visible: this.state.isDropdownVisible,
        // onClickOutside: this.uiHideDropdown
        trigger: 'mouseenter click'
      }}
      width={window.innerWidth >= 500 ? 420 : 800}
    >
      <div className="my-courses-toggler">
        <button type="button" className="button link courses" onClick={this.state.isDropdownVisible ? this.uiHideDropdown : this.uiShowDropdown}>
          Courses
          <div className="position-relative-wrapper">
            {this.renderNOfProblemsToReview()}
          </div>
        </button>
      </div>
    </StandardTooltip>
}

export default CoursesDropdown;
