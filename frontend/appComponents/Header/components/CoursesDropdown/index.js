import { withRouter } from 'react-router-dom';

import StandardTooltip from '~/components/StandardTooltip';
import Loading from '~/components/Loading';
import CourseCard from './components/CourseCard';

import MyModel from '~/models/MyModel';
import hideOnEsc from '~/services/hideOnEsc';
import MyDuck from '~/ducks/MyDuck';

import css from './index.css';

@withRouter
@connect(
  (state) => ({
    My: state.global.My
  }),
  (dispatch) => ({
    MyActions: dispatch(MyDuck.getActions)
  })
)
class CoursesDropdown extends React.Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    My: PropTypes.object.isRequired,
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
    const courseDtos = this.props.My.courses.map(MyModel.dtoToCourseCardProps);
    MyModel.sortByHowMuchToDo(courseDtos);
    return courseDtos;
  }

  getPinnedCourses = () => {
    const pinned = this.props.My.courses.filter((dto) =>
      this.props.My.pinnedCourseIds.includes(dto.course.id)
    )
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
      return null;
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
    const dtosToReview = MyModel.getDtosToReview(this.props.My.courses);
    const nOfProblems = MyModel.countAllProblemsToReview(dtosToReview);

    if (nOfProblems === 0) {
      return null;
    }

    return <div className={`button -to-review sync-button ${this.props.My.speCourses.status === 'request' ? '-saving' : ''} ${this.props.My.speCourses.status === 'success' ? '-just-saved' : ''}`}>
      {nOfProblems}
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
        visible: this.state.isDropdownVisible,
        onClickOutside: this.uiHideDropdown
      }}
      width={420}
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
