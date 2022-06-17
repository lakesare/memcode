import StandardTooltip from '~/components/StandardTooltip';
import Loading from '~/components/Loading';
import CourseCard from './components/CourseCard';

import MyModel from '~/models/MyModel';
import hideOnEsc from '~/services/hideOnEsc';

import css from './index.css';

@connect(
  (state) => ({
    My: state.global.My
  })
)
class CoursesDropdown extends React.Component {
  static propTypes = {
    My: PropTypes.object.isRequired,
  }

  state = {
    searchString: ''
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

  renderDropdown = () =>
    <div className={css.tooltip}>
      <Loading spe={this.props.My.speCourses}>
        {this.getCourseDtos().length === 0 ? this.renderNoCourses() :
        <>
          <div className="pinned-courses">
            {this.getPinnedCourses().map((courseDto) =>
              <CourseCard key={courseDto.course.id} courseDto={courseDto} pinned/>
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
        </>
        }
      </Loading>
    </div>

  renderNOfProblemsToReview = () => {
    const dtosToReview = MyModel.getDtosToReview(this.props.My.courses);
    const nOfProblems = MyModel.countAllProblemsToReview(dtosToReview);

    if (nOfProblems === 0) {
      return null;
    }

    return <div className="button -to-review">
      {nOfProblems}
    </div>;
  }

  render = () =>
    <StandardTooltip
      tooltipEl={this.renderDropdown()}
      tooltipProps={{
        className: 'standard-tooltip -no-padding -bright',
        interactive: true,
        placement: 'bottom-end',
        trigger: 'click',
        arrow: false,
        plugins: [hideOnEsc]
      }}
      width={420}
    >
      <div className="my-courses-toggler">
        <button type="button" className="button link courses">
          Courses
          <div className="position-relative-wrapper">
            {this.renderNOfProblemsToReview()}
          </div>
        </button>
      </div>
    </StandardTooltip>
}

export default CoursesDropdown;
