import { orFalse } from '~/services/orFalse';
import { Link } from 'react-router';
import CourseCategoryApi from '~/api/CourseCategoryApi';

class Breadcrumbs extends React.Component {
  static propTypes = {
    courseCategoryId: orFalse(PropTypes.number).isRequired
  }

  state = {
    courseCategory: false,
    courseCategoryGroup: false
  }

  componentDidMount = () =>
    this.refreshCategoryAndGroup()

  componentDidUpdate = (prevProps) => {
    if (prevProps.courseCategoryId !== this.props.courseCategoryId) {
      this.refreshCategoryAndGroup();
    }
  }

  refreshCategoryAndGroup = () => {
    if (this.props.courseCategoryId) {
      this.apiGetCategories();
    } else {
      this.setState({ courseCategory: false, courseCategoryGroup: false });
    }
  }

  apiGetCategories = () =>
    CourseCategoryApi.selectWithGroups(false)
      .then(({ courseCategories, courseCategoryGroups }) => {
        const courseCategory = courseCategories.find((category) => category.id === this.props.courseCategoryId);
        const courseCategoryGroup = courseCategoryGroups.find((group) => group.id === courseCategory.courseCategoryGroupId);
        this.setState({ courseCategory, courseCategoryGroup });
      })

  renderLinkToAllCourses = () =>
    <li>
      <Link to="/courses">Courses</Link>
    </li>

  renderArrow = () =>
    <li key="arrow" className="arrow">
      <i className="fa fa-caret-right"/>
    </li>

  renderCategory = () =>
    <li key="category">
      <Link to={`/courses?categoryId=${this.state.courseCategory.id}`}>
        {this.state.courseCategory.name}
      </Link>
    </li>

  renderGroup = () =>
    <li key="group">{this.state.courseCategoryGroup.name}</li>

  renderFetchedCategoryAndGroup = () => (
    // only if already fetched
    this.state.courseCategory ?
    [
      this.renderGroup(),
      this.renderArrow(),
      this.renderCategory()
    ] :
    null
  )

  render = () =>
    <section className="breadcrumbs">
      <div className="container">
        <ul>
          {this.renderLinkToAllCourses()}
          {this.renderArrow()}
          {this.renderFetchedCategoryAndGroup()}
        </ul>
      </div>
    </section>
}

export default Breadcrumbs;
