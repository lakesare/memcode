import { orFalse } from '~/services/orFalse';
import CourseCategoryApi from '~/api/CourseCategoryApi';
import CourseApi from '~/api/CourseApi';

import { Link } from 'react-router';
import Loading from '~/components/Loading';
import StarRating from '~/components/StarRating';

class Breadcrumbs extends React.Component {
  static propTypes = {
    courseCategoryId: orFalse(PropTypes.number).isRequired,
    courseId: PropTypes.string.isRequired,
    ifCanRateCourse: PropTypes.bool.isRequired
  }

  state = {
    courseCategory: false,
    courseCategoryGroup: false,
    speGetRatings: {},
    rating: false
  }

  componentDidMount = () => {
    this.apiGetCategoryAndGroup();
    this.apiGetRatings();
  }

  componentDidUpdate = (prevProps) => {
    if (prevProps.courseCategoryId !== this.props.courseCategoryId) {
      this.apiGetCategoryAndGroup();
    }
  }

  apiGetCategoryAndGroup = () => {
    if (this.props.courseCategoryId) {
      this.apiGetCategories();
    } else {
      this.setState({ courseCategory: false, courseCategoryGroup: false });
    }
  }

  apiGetRatings = () =>
    CourseApi.getAllRatings(
      (spe) => this.setState({ speGetRatings: spe }),
      this.props.courseId
    )
      .then(({ ownRating }) => {
        this.setState({ rating: ownRating });
      })

  apiGetCategories = () =>
    CourseCategoryApi.selectWithGroups(false)
      .then(({ courseCategories, courseCategoryGroups }) => {
        const courseCategory = courseCategories.find((category) => category.id === this.props.courseCategoryId);
        const courseCategoryGroup = courseCategoryGroups.find((group) => group.id === courseCategory.courseCategoryGroupId);
        this.setState({ courseCategory, courseCategoryGroup });
      })

  apiUpdateRating = (rating) => {
    this.setState({ rating });
    this.apiRate(rating);
  }

  apiRate = (rating) =>
    CourseApi.rate(
      (spe) => this.setState({ speGetRatings: spe }),
      this.props.courseId,
      rating
    )

  renderLinkToAllCourses = () =>
    <li>
      <Link to="/courses">All Courses</Link>
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

  renderNavigation = () =>
    <ul className="navigation">
      {this.renderLinkToAllCourses()}
      {this.renderArrow()}
      {this.renderFetchedCategoryAndGroup()}
    </ul>

  renderRating = () =>
    <div className="rating">
      <Loading enabledStatuses={['success']} spe={this.state.speGetRatings}>{({ averageRating, ratings }) =>
        ratings.length > 0 &&
        <span>[{averageRating}/5 | {ratings.length} ratings]</span>
      }</Loading>
      <StarRating
        className="stars"
        rating={this.state.rating || false}
        updateRating={this.apiUpdateRating}
        readOnly={!this.props.ifCanRateCourse}
      />
    </div>

  render = () =>
    <section className="breadcrumbs">
      <div className="container">
        {this.renderNavigation()}
        {this.renderRating()}
      </div>
    </section>
}

export default Breadcrumbs;
