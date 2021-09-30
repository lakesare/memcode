import StandardTooltip from '~/components/StandardTooltip';
import Loading from '~/components/Loading';
import MyModel from '~/models/MyModel';

import CourseCard from './components/CourseCard';

import css from './index.css';

@connect(
  (state) => ({
    My: state.global.My
  })
)
class CoursesDropdown extends React.Component {
  static propTypes = {
    toggler: PropTypes.object.isRequired,
    My: PropTypes.object.isRequired,
  }

  filterCoursesForCategory = (dtos) =>
    dtos

  getCourseDtos = () => {
    const courseDtos = this.props.My.courses.map(MyModel.dtoToCourseCardProps);
    MyModel.sortByHowMuchToDo(courseDtos);
    return courseDtos;
  }

  getPinnedCourses = () => {
    const pinned = this.props.My.courses.filter((dto) =>
      this.props.My.pinnedCourseIds.includes(dto.course.id)
    )
      .map(MyModel.dtoToCourseCardProps);
    return pinned;
  }

  renderDropdown = () =>
    <div className={css.tooltip}>
      <Loading spe={this.props.My.speCourses}>
        <>
          <div className="pinned-courses">
            {this.getPinnedCourses().map((courseDto) =>
              <CourseCard key={courseDto.course.id} courseDto={courseDto} pinned/>
            )}
          </div>

          <div className="all-courses">
            {this.filterCoursesForCategory(this.getCourseDtos()).map((courseDto) =>
              <CourseCard key={courseDto.course.id} courseDto={courseDto}/>
            )}
          </div>
        </>
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
        arrow: false
      }}
      width={600}
    >
      <div className="my-courses-toggler">
        {this.props.toggler}

        {this.renderNOfProblemsToReview()}
      </div>
    </StandardTooltip>
}

export default CoursesDropdown;
