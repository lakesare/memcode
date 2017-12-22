import orFalse from '~/services/orFalse';
import CourseCategoryApi from '~/api/CourseCategoryApi';
import CourseCategoryModel from '~/models/CourseCategoryModel';
import CourseCategoryGroupModel from '~/models/CourseCategoryGroupModel';

import onClickOutside from 'react-onclickoutside';
import Loading from '~/components/Loading';

@onClickOutside
class CourseCategorySelect extends React.Component {
  static propTypes = {
    courseCategoryId: orFalse(PropTypes.number).isRequired,
    updateCourseCategoryId: PropTypes.func.isRequired
  }

  state = {
    ifDropdownIsOpen: false,
    speGetCategories: {}
  }

  componentDidMount = () =>
    this.apiGetCategories()

  apiGetCategories = () =>
    CourseCategoryApi.selectWithGroups(
      (spe) => this.setState({ speGetCategories: spe })
    )

  updateCourseCategoryId = (id) => {
    this.closeDropdown();
    this.props.updateCourseCategoryId(id);
  }

  openDropdown  = () => this.setState({ ifDropdownIsOpen: true })
  closeDropdown = () => this.setState({ ifDropdownIsOpen: false })
  toggleDropdown = () => this.setState({ ifDropdownIsOpen: !this.state.ifDropdownIsOpen })

  // ignored for some reason until we choose a new courseCategoryId
  handleClickOutside = () => {
    console.log('hi');
    this.closeDropdown();
  }

  ifCategoryIsActive = (category) =>
    this.props.courseCategoryId === category.id

  renderSelectedCategory = (category) =>
    category.name

  renderCategoryLi = (category) =>
    <li
      key={category.id}
      onClick={() => this.updateCourseCategoryId(category.id)}
      className={`category ${this.ifCategoryIsActive(category) ? '-active' : '-non-active'}`}
    >
      <div className="category-insides">
        <span className="category-name">{category.name}</span>
        <span className="amount-of-courses"><b>(</b>{category.amountOfCourses}<b>)</b></span>
      </div>
    </li>

  renderToggler = (categories, categoryId) =>
    <button type="button" className="toggler" onClick={this.toggleDropdown}>
      {this.renderSelectedCategory(categories.find((category) => category.id === categoryId))}
      <i className="fa fa-caret-down"/>
    </button>

  renderDropdown = (courseCategoryGroups, courseCategories) =>
    <div className="dropdown standard-list-of-course-categories">
      <ul className="groups">
        {CourseCategoryGroupModel.sortByAmountOfCourses(courseCategoryGroups, courseCategories).map((group) =>
          <li className="group" key={group.id}>
            <span className="group-name">{group.name}</span>
            <ul className="categories">
              {CourseCategoryModel.deriveAndSortCategoriesPerGroup(courseCategories, group).map(this.renderCategoryLi)}
            </ul>
          </li>
        )}
      </ul>
    </div>

  render = () =>
    <Loading enabledStatuses={['success', 'error']} spe={this.state.speGetCategories}>{({ courseCategoryGroups, courseCategories }) =>
      <section className="standard-dropdown-wrapper course-categories-select">
        {this.renderToggler(courseCategories, this.props.courseCategoryId)}
        {
          this.state.ifDropdownIsOpen &&
          this.renderDropdown(courseCategoryGroups, courseCategories)
        }
      </section>
    }</Loading>
}

export default CourseCategorySelect;
