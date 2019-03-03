import orFalse from '~/services/orFalse';
import CourseCategoryModel from '~/models/CourseCategoryModel';
import CourseCategoryGroupModel from '~/models/CourseCategoryGroupModel';

import { Link } from 'react-router-dom'

class CourseCategories extends React.Component {
  static propTypes = {
    courseCategoryId: orFalse(PropTypes.number).isRequired,
    courseCategories: PropTypes.array.isRequired,
    courseCategoryGroups: PropTypes.array.isRequired
  }

  ifCategoryIsActive = (category) =>
    this.props.courseCategoryId === category.id

  renderCategoryLi = (category) =>
    <li
      key={category.id}
      className={`category ${this.ifCategoryIsActive(category) ? '-active' : '-non-active'}`}
    >
      <Link className="category-insides" to={`${window.location.pathname}?categoryId=${category.id}`}>
        <span className="category-name">{category.name}</span>
        <span className="amount-of-courses">
          <b>(</b>{category.amountOfCourses}<b>)</b>
        </span>
      </Link>
    </li>

  render = () =>
    <nav className="standard-list-of-course-categories">
      <ul className="groups">
        {CourseCategoryGroupModel.sortByAmountOfCourses(this.props.courseCategoryGroups, this.props.courseCategories)
          .map((group) =>
            <li className="group" key={group.id}>
              <span className="group-name">{group.name}</span>
              <ul className="categories">
                {CourseCategoryModel.deriveAndSortCategoriesPerGroup(this.props.courseCategories, group).map(this.renderCategoryLi)}
              </ul>
            </li>
        )}
      </ul>
    </nav>
}

export default CourseCategories;
