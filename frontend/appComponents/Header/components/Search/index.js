import orFalse from '~/services/orFalse';
import CourseApi from '~/api/CourseApi';

import disableOnSpeRequest from '~/services/disableOnSpeRequest';
import onClickOutside from 'react-onclickoutside';
import { Course } from './components/Course';

import css from './index.css';

const ESC_KEY = 27;

@onClickOutside
class Search extends React.Component {
  static propTypes = {
    currentUser: orFalse(PropTypes.object).isRequired
  }

  state = {
    speSearch: {},
    searchString: '',
    courseDatas: [],
    ifDropdownIsOpen: false
  }

  handleClickOutside = () => {
    this.clearAndCloseDropdown();
  }

  apiSearch = (searchString) =>
    CourseApi.selectSearch(
      (spe) => this.setState({ speSearch: spe }),
      searchString
    )
      .then((courseDatas) => {
        // of searchString is still relevant
        if (this.state.searchString === searchString) {
          this.setState({ courseDatas });
        }
      })

  updateSearchString = (event) => {
    const searchString = event.target.value;
    this.setState({ searchString });
    if (searchString.length === 0) {
      this.clearAndCloseDropdown();
    } else {
      if (this.state.ifDropdownIsOpen === false) {
        this.setState({ ifDropdownIsOpen: true });
      }
      this.apiSearch(searchString);
    }
  }

  clearAndCloseDropdown = () =>
    this.setState({ ifDropdownIsOpen: false, speSearch: {}, searchString: '' })

  onFocus = () => {
    this.setState({ ifDropdownIsOpen: true });

    document.addEventListener('keydown', this.handleEsc);
  }

  onBlur = () => {
    document.removeEventListener('keydown', this.handleEsc);
  }

  handleEsc = (event) => {
    if (event.keyCode === ESC_KEY) {
      this.clearAndCloseDropdown();
    }
  }

  render = () =>
    <section className={`${css.search} search standard-dropdown-wrapper`}>
      <div className="toggler">
        <i className="material-icons">search</i>
        <input
          placeholder="Find a course"
          onChange={this.updateSearchString}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          value={this.state.searchString}
          type="text"

          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="off"
        />
      </div>

      {
        this.state.ifDropdownIsOpen &&
        this.state.courseDatas.length > 0 &&
        <div className="standard-dropdown">
          <ul style={disableOnSpeRequest(this.state.speSearch, { opacity: 0.9 })}>
            {this.state.courseDatas.map((courseData) =>
              <Course
                key={courseData.course.id}
                uiCloseDropdown={this.clearAndCloseDropdown}
                courseData={courseData}
                currentUser={this.props.currentUser}
                searchString={this.state.searchString}
              />
            )}
          </ul>
        </div>
      }
    </section>
}

export { Search };
