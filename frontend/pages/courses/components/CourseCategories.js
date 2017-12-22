import orFalse from '~/services/orFalse';
import CourseCategoryApi from '~/api/CourseCategoryApi';
import CourseCategoryModel from '~/models/CourseCategoryModel';
import CourseCategoryGroupModel from '~/models/CourseCategoryGroupModel';

import { Link } from 'react-router';
import Loading from '~/components/Loading';

class CourseCategories extends React.Component {
  static propTypes = {
    courseCategoryId: orFalse(PropTypes.number).isRequired
  }

  state = {
    speGetCategories: {}
  }

  componentDidMount = () =>
    this.apiGetCategories()

  apiGetCategories = () =>
    CourseCategoryApi.selectWithGroups(
      (spe) => this.setState({ speGetCategories: spe })
    )

  ifCategoryIsActive = (category) =>
    this.props.courseCategoryId === category.id

  renderCategoryLi = (category) =>
    <li
      key={category.id}
      className={`category ${this.ifCategoryIsActive(category) ? '-active' : '-non-active'}`}
    >
      <Link className="category-insides" to={`/courses?categoryId=${category.id}`}>
        <span className="category-name">{category.name}</span>
        <span className="amount-of-courses"><b>(</b>{category.amountOfCourses}<b>)</b></span>
      </Link>
    </li>

  render = () =>
    <nav className="standard-list-of-course-categories">
      <Loading spe={this.state.speGetCategories}>{({ courseCategoryGroups, courseCategories }) =>
        <ul className="groups">
          {CourseCategoryGroupModel.sortByAmountOfCourses(courseCategoryGroups, courseCategories)
            .map((group) =>
              <li className="group" key={group.id}>
                <span className="group-name">{group.name}</span>
                <ul className="categories">
                  {CourseCategoryModel.deriveAndSortCategoriesPerGroup(courseCategories, group).map(this.renderCategoryLi)}
                </ul>
              </li>
          )}
        </ul>
      }</Loading>
    </nav>
}

export default CourseCategories;
