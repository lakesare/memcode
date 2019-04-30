import { orFalse } from '~/services/orFalse';
import CourseCategoryApi from '~/api/CourseCategoryApi';

import { Link } from 'react-router-dom';

class Breadcrumbs extends React.Component {
  static propTypes = {
    courseCategoryId: orFalse(PropTypes.number).isRequired
  }

  state = {
    courseCategory: false,
    courseCategoryGroup: false
  }

  componentDidMount = () => {
    this.apiGetCategoryAndGroup();
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

  apiGetCategories = () =>
    CourseCategoryApi.selectWithGroups(false)
      .then(({ courseCategories, courseCategoryGroups }) => {
        const courseCategory = courseCategories.find((category) => category.id === this.props.courseCategoryId);
        const courseCategoryGroup = courseCategoryGroups.find((group) => group.id === courseCategory.courseCategoryGroupId);
        this.setState({ courseCategory, courseCategoryGroup });
      })

  render = () => (
    // only if already fetched
    this.state.courseCategory &&
    <div className="category">
      {`To `}
      <Link to={`/courses?categoryId=${this.state.courseCategory.id}`}>
        {this.state.courseCategory.name}
      </Link>
    </div>
  )
}

export default Breadcrumbs;
