import orFalse from '~/services/orFalse';
import CourseCategoryModel from '~/models/CourseCategoryModel';
import CourseCategoryGroupModel from '~/models/CourseCategoryGroupModel';

import { Link } from 'react-router-dom';

import css from './index.scss';

class CourseCategories extends React.Component {
  static propTypes = {
    selectedCourseCategoryId: orFalse(PropTypes.number).isRequired,
    courseCategories: PropTypes.array.isRequired,
    courseCategoryGroups: PropTypes.array.isRequired,
    ifShowAmountOfCoursesInCategory: PropTypes.bool.isRequired,
    isSelectedCategoryActive: PropTypes.bool,
    showSelectedSection: PropTypes.bool
  }

  static defaultProps = {
    showSelectedSection: false
  }

  ifCategoryIsSelected = (category) =>
    this.props.selectedCourseCategoryId === category.id

  renderCategoryLi = (category) =>
    <li
      key={category.id}
      className={`category ${this.ifCategoryIsSelected(category) ? '-active' : '-non-active'}`}
    >
      <Link
        className="name"
        to={!this.ifCategoryIsSelected(category) ? `${window.location.pathname}?categoryId=${category.id}` : window.location.pathname}
      >
        {category.name}

        {
          this.props.ifShowAmountOfCoursesInCategory &&
          category.amountOfCourses &&
          category.amountOfCourses !== '0' ?
            <span className="amount-of-courses">({category.amountOfCourses})</span> :
            null
        }
      </Link>

      {
        this.ifCategoryIsSelected(category) &&
        <Link className="cross" to={window.location.pathname}>
          <i className="material-icons">clear</i>
        </Link>
      }
    </li>

  renderSelectedCategory = () =>
    <li
      key="selected"
      className={`category ${this.props.isSelectedCategoryActive ? '-active' : '-non-active'}`}
    >
      <Link
        className="name"
        to={!this.props.isSelectedCategoryActive ? `${window.location.pathname}?categoryId=selected` : `${window.location.pathname}?categoryId=all`}
      >
        Selected
        
        {
          this.props.ifShowAmountOfCoursesInCategory &&
          <span className="amount-of-courses">(20)</span>
        }
      </Link>

      {
        this.props.isSelectedCategoryActive &&
        <Link className="cross" to={`${window.location.pathname}?categoryId=all`}>
          <i className="material-icons">clear</i>
        </Link>
      }
    </li>

  render = () =>
    <nav className={`course-categories-nav ${css.nav}`}>
      <ul className="groups">
        {/* Selected category at the top - only on main courses page */}
        {this.props.showSelectedSection &&
          <li className="group" key="selected-group">
            <h2 className="group-name">Featured</h2>
            <ul className="categories">
              {this.renderSelectedCategory()}
            </ul>
          </li>
        }
        
        {CourseCategoryGroupModel.sort(this.props.courseCategoryGroups)
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
