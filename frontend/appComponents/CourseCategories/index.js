import orFalse from '~/services/orFalse';
import CourseCategoryModel from '~/models/CourseCategoryModel';
import CourseCategoryGroupModel from '~/models/CourseCategoryGroupModel';

import { Link } from 'react-router-dom';

import css from './index.css';

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
      <Link to={`${window.location.pathname}?categoryId=${category.id}`}>
        {category.name}
      </Link>
    </li>

  render = () =>
    <nav className={`course-categories-nav ${css.nav}`}>
      <ul className="groups">
        {CourseCategoryGroupModel.sortByAmountOfCourses(this.props.courseCategoryGroups, this.props.courseCategories)
          .map((group) =>
            <li className="group" key={group.id}>
              <h2 className="group-name">{group.name}</h2>
              <ul className="categories">
                {CourseCategoryModel.deriveAndSortCategoriesPerGroup(this.props.courseCategories, group).map(this.renderCategoryLi)}
              </ul>
            </li>
        )}
      </ul>
    </nav>
}

export default CourseCategories;
