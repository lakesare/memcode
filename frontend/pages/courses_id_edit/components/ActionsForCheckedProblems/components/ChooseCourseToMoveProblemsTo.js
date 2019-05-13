import CourseApi from '~/api/CourseApi';

import onClickOutside from 'react-onclickoutside';
import { Loading } from '~/components/Loading';
import { Dropdown } from './components/Dropdown';

@onClickOutside
class ChooseCourseToMoveProblemsTo extends React.Component {
  static propTypes = {
    apiMoveAllCheckedProblemsToCourse: PropTypes.func.isRequired,
    amount: PropTypes.number.isRequired
  }

  state = {
    speCourses: {},
    searchString: '',
    selectedCourse: null,
    ifDropdownIsOpen: false
  }

  componentDidMount = () =>
    this.apiSelectAllCreated()

  apiSelectAllCreated = () =>
    CourseApi.selectAllCreated(
      (spe) => this.setState({ speCourses: spe })
    )

  apiMove = () =>
    this.props.apiMoveAllCheckedProblemsToCourse(this.state.selectedCourse.id)

  handleClickOutside = () =>
    this.setState({ ifDropdownIsOpen: false })

  updateSearchString = (event) => {
    const newString = event.target.value;
    if (newString.length === 0) {
      this.setState({
        selectedCourse: null,
        searchString: newString
      });
    } else {
      this.setState({
        searchString: newString
      });
    }
  }

  uiSelectCourse = (course) =>
    this.setState({
      selectedCourse: course,
      ifDropdownIsOpen: false,
      searchString: course.title
    })

  render = () =>
    <Loading spe={this.state.speCourses}>{(response) =>
      response.length > 0 ?
        <section className="choose-course-to-move-problems-to">
          <label htmlFor="search-input">
            Move <b className="amount">{this.props.amount}</b> flashcards to:
          </label>

          <div className="standard-dropdown-wrapper standard-input -Select">
            <input
              type="text"
              id="search-input"
              className="toggler standard-input -TextInput"
              value={this.state.searchString}
              onChange={this.updateSearchString}
              onFocus={() => this.setState({ ifDropdownIsOpen: true })}
              placeholder="Another course..."
            />

            {
              this.state.ifDropdownIsOpen &&
              <Dropdown
                courses={response.map((a) => a.course)}
                searchString={this.state.searchString}
                uiSelectCourse={this.uiSelectCourse}
              />
            }
          </div>

          {
            this.state.selectedCourse &&
            <button
              type="button"
              className="button -purple-o -move"
              onClick={this.apiMove}
            >Move <i className="fa fa-exchange"/></button>
          }
        </section> :
        <section/>
    }</Loading>
}

export { ChooseCourseToMoveProblemsTo };
