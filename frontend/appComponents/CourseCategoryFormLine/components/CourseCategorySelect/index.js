import orFalse from '~/services/orFalse';
import CourseCategoryApi from '~/api/CourseCategoryApi';
import CourseCategoryModel from '~/models/CourseCategoryModel';
import CourseCategoryGroupModel from '~/models/CourseCategoryGroupModel';

import onClickOutside from 'react-onclickoutside';
import Loading from '~/components/Loading';

import css from './index.scss';

@onClickOutside
class CourseCategorySelect extends React.Component {
  static propTypes = {
    courseCategoryId: orFalse(PropTypes.number).isRequired,
    updateCourseCategoryId: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.togglerButtonRef = React.createRef();
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
    this.togglerButtonRef.current.focus();
    this.props.updateCourseCategoryId(id);
  }

  openDropdown  = () => this.setState({ ifDropdownIsOpen: true })
  closeDropdown = () => this.setState({ ifDropdownIsOpen: false })
  toggleDropdown = () => this.setState({ ifDropdownIsOpen: !this.state.ifDropdownIsOpen })

  // ignored for some reason until we choose a new courseCategoryId
  handleClickOutside = () => {
    this.closeDropdown();
  }

  ifCategoryIsActive = (category) =>
    this.props.courseCategoryId === category.id

  renderCategoryLi = (category) =>
    <li
      key={category.id}
      className={`category ${this.ifCategoryIsActive(category) ? '-active' : '-non-active'}`}
    >
      <button
        type="button"
        onClick={() => this.updateCourseCategoryId(category.id)}
      >{category.name}</button>
    </li>

  renderToggler = () => {
    let categoryName;
    if (this.state.speGetCategories.status === 'success') {
      const courseCategories = this.state.speGetCategories.payload.courseCategories;
      categoryName = courseCategories
        .find((category) => category.id === this.props.courseCategoryId)
        .name;
    } else if (this.props.courseCategoryId === 1) {
      categoryName = 'Other';
    } else {
      categoryName = <span/>;
    }

    return <button ref={this.togglerButtonRef} type="button" className="toggler" onClick={this.toggleDropdown}>
      {categoryName}
      <i className="fa fa-caret-down"/>
    </button>;
  }

  renderDropdown = (courseCategoryGroups, courseCategories) =>
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

  render = () =>
    <section className={`standard-input -Select standard-dropdown-wrapper ${css.section}`}>
      {this.renderToggler()}
      <Loading enabledStatuses={['success', 'error']} spe={this.state.speGetCategories}>{({ courseCategoryGroups, courseCategories }) => (
        this.state.ifDropdownIsOpen &&
        this.renderDropdown(courseCategoryGroups, courseCategories)
      )}</Loading>
    </section>
}

export default CourseCategorySelect;
