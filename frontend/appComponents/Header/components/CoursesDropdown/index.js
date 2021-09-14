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

  renderDropdown = () =>
    <div className={css.tooltip}>
      <Loading spe={this.props.My.speCourses}>{() =>
        this.filterCoursesForCategory(this.getCourseDtos()).map((courseDto) =>
          <CourseCard key={courseDto.course.id} courseDto={courseDto}/>
        )
      }</Loading>
    </div>

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
      {this.props.toggler}
    </StandardTooltip>
}

export default CoursesDropdown;
