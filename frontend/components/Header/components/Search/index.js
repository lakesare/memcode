import * as CourseApi from '~/api/Course';

import onClickOutside from 'react-onclickoutside';
import { Loading } from '~/components/Loading';
import { Course } from './components/Course';

import css from './index.css';

@onClickOutside
class Search extends React.Component {
  static propTypes = {
    currentUser: PropTypes.object
  }

  state = {
    searchString: '',
    speSearch: {},
    ifDropdownIsOpen: false
  }

  handleClickOutside = () =>
    this.clearAndCloseDropdown()

  apiSearch = (searchString) =>
    CourseApi.selectSearch(
      (spe) => this.setState({ speSearch: spe, ifDropdownIsOpen: true }),
      searchString
    )

  updateSearchString = (event) => {
    const searchString = event.target.value;
    this.setState({ searchString });
    if (searchString.length === 0) {
      this.clearAndCloseDropdown();
    } else {
      this.apiSearch(searchString);
    }
  }

  clearAndCloseDropdown = () =>
    this.setState({ speSearch: {}, ifDropdownIsOpen: false })

  render = () =>
    <section className={`${css.search} search`}>
      <div className="toggler">
        <i className="fa fa-search"/>
        <input
          placeholder="Find a course..."
          onChange={this.updateSearchString}
          value={this.state.searchString}
          type="text"
          autoComplete={false}
          autoCorrect={false}
          autoCapitalize={false}
          spellCheck={false}
        />
      </div>

      {
        this.state.ifDropdownIsOpen &&
        <div className="standard-dropdown">
          <Loading spe={this.state.speSearch}>{(courseDatas) =>
            <ul>
              {courseDatas.map((courseData) =>
                <Course
                  key={courseData.course.id}
                  courseData={courseData}
                  currentUser={this.props.currentUser}
                  searchString={this.state.searchString}
                />
              )}
            </ul>
          }</Loading>
        </div>
      }
    </section>
}

export { Search };
