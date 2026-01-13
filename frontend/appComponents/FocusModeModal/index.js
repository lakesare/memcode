import TogglerAndModal from '~/components/TogglerAndModal';
import TabNavigation from '~/components/TabNavigation';
import SettingsDuck from '~/ducks/SettingsDuck';
import MyDuck from '~/ducks/MyDuck';

import css from './index.scss';

@connect(
  (state) => ({
    Settings: state.global.Settings,
    My: state.global.My
  }),
  (dispatch) => ({
    SettingsActions: SettingsDuck.getActions(dispatch),
    MyActions: dispatch(MyDuck.getActions)
  })
)
class FocusModeModal extends React.Component {
  static propTypes = {
    toggler: PropTypes.element.isRequired,
    Settings: PropTypes.object.isRequired,
    SettingsActions: PropTypes.object.isRequired,
    My: PropTypes.object.isRequired,
    MyActions: PropTypes.object.isRequired
  }

  state = {
    showMatchingCourses: false,
    selectedTab: 'By Category',
    savedCourseTitles: []
  }

  componentDidMount() {
    this.loadSavedCourseTitles();
  }

  loadSavedCourseTitles = () => {
    const saved = localStorage.getItem('focusModeSavedCourseTitles');
    if (saved) {
      try {
        this.setState({ savedCourseTitles: JSON.parse(saved) });
      } catch (e) {
        // If parsing fails, reset to empty array
        localStorage.removeItem('focusModeSavedCourseTitles');
      }
    }
  }

  saveCourseTitle = (title) => {
    if (!title || title.trim() === '') return;

    this.setState((prevState) => {
      // Remove duplicates and add to the beginning
      const filtered = prevState.savedCourseTitles.filter(t => t !== title);
      const newTitles = [title, ...filtered].slice(0, 10); // Keep max 10
      localStorage.setItem('focusModeSavedCourseTitles', JSON.stringify(newTitles));
      return { savedCourseTitles: newTitles };
    });
  }

  removeSavedCourseTitle = (title) => {
    this.setState((prevState) => {
      const newTitles = prevState.savedCourseTitles.filter(t => t !== title);
      localStorage.setItem('focusModeSavedCourseTitles', JSON.stringify(newTitles));
      return { savedCourseTitles: newTitles };
    });
  }


  handleCategorySelect = (categoryId) => {
    // Clear substring if it exists
    if (this.props.Settings.focusedSubstring && this.props.Settings.focusedSubstring.trim() !== '') {
      this.props.SettingsActions.updateSetting('focusedSubstring', '');
    }

    if (this.ifCategoryIsActive(categoryId)){
      this.props.SettingsActions.updateSetting('focusedCategoryId', null);
    } else {
      this.props.SettingsActions.updateSetting('focusedCategoryId', categoryId);
    }
  }

  handleSubstringChange = (event) => {
    const substring = event.target.value;
    this.props.SettingsActions.updateSetting('focusedSubstring', substring);

    // If substring is entered, clear category selection
    if (substring.trim() !== '' && this.props.Settings.focusedCategoryId) {
      this.props.SettingsActions.updateSetting('focusedCategoryId', null);
    }
  }

  handleInputFocus = () => {
    this.setState({ showMatchingCourses: true });
  }

  handleInputBlur = () => {
    // Delay hiding to allow for interaction with the preview
    setTimeout(() => {
      this.setState({ showMatchingCourses: false });
    }, 200);
  }

  getMatchingCourses = () => {
    if (!this.props.My.courses || this.props.My.courses.length === 0) {
      return [];
    }

    const substring = this.props.Settings.focusedSubstring || '';
    
    // If input is focused but no substring, show all courses
    if (this.state.showMatchingCourses && substring.trim() === '') {
      return this.props.My.courses;
    }
    
    // If there's a substring, always show filtered results (even when not focused)
    if (substring.trim() !== '') {
      return this.props.My.courses.filter((course) => {
        const courseTitle = course.course ? course.course.title : course.title;
        return courseTitle.toLowerCase().startsWith(substring.toLowerCase());
      });
    }

    // If not focused and no substring, don't show any courses
    return [];
  }

  getUserCategories = () => {
    if (!this.props.My.courses || this.props.My.courses.length === 0) {
      return [];
    }

    // Group courses by category and count them
    const categoryMap = {};
    
    this.props.My.courses.forEach((course) => {
      if (course.courseCategory) {
        const categoryId = course.courseCategory.id;
        const categoryName = course.courseCategory.name;
        
        if (!categoryMap[categoryId]) {
          categoryMap[categoryId] = {
            id: categoryId,
            name: categoryName,
            count: 0
          };
        }
        categoryMap[categoryId].count++;
      }
    });

    // Convert to array and sort by course count (descending), then by name
    return Object.values(categoryMap).sort((a, b) => {
      if (a.count !== b.count) {
        return b.count - a.count; // Higher count first
      }
      return a.name.localeCompare(b.name); // Then alphabetically
    });
  }

  ifCategoryIsActive = (categoryId) => {
    return this.props.Settings.focusedCategoryId === categoryId;
  }

  renderCourseTitle = (course) => {
    const courseTitle = course.course ? course.course.title : course.title;
    const substring = this.props.Settings.focusedSubstring || '';
    
    if (substring.trim() === '') {
      return courseTitle;
    }
    
    const lowerTitle = courseTitle.toLowerCase();
    const lowerSubstring = substring.toLowerCase();
    
    if (lowerTitle.startsWith(lowerSubstring)) {
      const highlightedPart = courseTitle.substring(0, substring.length);
      const remainingPart = courseTitle.substring(substring.length);
      return (
        <span>
          <span className="highlighted">{highlightedPart}</span>
          {remainingPart}
        </span>
      );
    }
    
    return courseTitle;
  }

  handleCourseClick = (course) => {
    const courseTitle = course.course ? course.course.title : course.title;
    this.props.SettingsActions.updateSetting('focusedSubstring', courseTitle);
    this.setState({ showMatchingCourses: false });
  }

  handleSavedTitleClick = (title) => {
    this.props.SettingsActions.updateSetting('focusedSubstring', title);
    // Clear category if set
    if (this.props.Settings.focusedCategoryId) {
      this.props.SettingsActions.updateSetting('focusedCategoryId', null);
    }
  }

  handleSave = (closeModal) => {
    // Save the current substring if it exists
    const substring = this.props.Settings.focusedSubstring;
    if (substring && substring.trim().length > 0) {
      const trimmedTitle = substring.trim();

      // Save synchronously before closing modal
      const filtered = this.state.savedCourseTitles.filter(t => t !== trimmedTitle);
      const newTitles = [trimmedTitle, ...filtered].slice(0, 10);
      localStorage.setItem('focusModeSavedCourseTitles', JSON.stringify(newTitles));

      this.setState({ savedCourseTitles: newTitles });
    }
    closeModal();
  }

  selectTab = (tabName) => {
    this.setState({ selectedTab: tabName });
  }

  renderSavedCourseTitles = () => {
    if (this.state.savedCourseTitles.length === 0) {
      return null;
    }

    // Sort alphabetically for display
    const sortedTitles = [...this.state.savedCourseTitles].sort((a, b) => a.localeCompare(b));

    return (
      <div className="saved-course-titles">
        {sortedTitles.map((title) => (
          <div key={title} className="saved-title-item">
            <button
              type="button"
              className="title-button"
              onClick={() => this.handleSavedTitleClick(title)}
            >
              {title}
            </button>
            <button
              type="button"
              className="delete-button"
              onClick={(e) => {
                e.stopPropagation();
                this.removeSavedCourseTitle(title);
              }}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    );
  }

  renderMatchingCourses = () => {
    const matchingCourses = this.getMatchingCourses();

    if (matchingCourses.length === 0) {
      return null;
    }

    return (
      <div className="matching-courses-list">
        {matchingCourses.map((course) => (
          <div
            key={course.course.id}
            className="course-item"
            onClick={() => this.handleCourseClick(course)}
          >
            {this.renderCourseTitle(course)}
          </div>
        ))}
      </div>
    );
  }

  renderCategoryButton = (category) => {
    const isSubstringActive = this.props.Settings.focusedSubstring && this.props.Settings.focusedSubstring.trim() !== '';
    return (
      <button
        key={category.id}
        type="button"
        className={`category-button ${this.ifCategoryIsActive(category.id) ? '-active' : ''} ${isSubstringActive ? '-faded' : ''}`}
        onClick={() => this.handleCategorySelect(category.id)}
      >
        <span>{category.name}</span> <span className="n">({category.count} course{category.count !== 1 ? 's' : ''})</span>
      </button>
    );
  }

  render = () =>
    <TogglerAndModal toggler={this.props.toggler}>{(closeModal) => (
      <section className={`standard-modal standard-modal--sm ${css.local}`}>
        <div className="standard-modal__header">
          <h2 className="standard-modal__title">Focus Mode</h2>
          <div className="standard-modal__description">Select a category to focus on. When focus mode is active, you'll only see courses from the selected category.</div>
          <TabNavigation
            tabs={['By Category', 'By Course Title']}
            selectTab={this.selectTab}
            selectedTab={this.state.selectedTab}
          />
        </div>

        <div className="standard-modal__main">
          <div className="focus-content">
            <div className="setting">
              {this.state.selectedTab === 'By Category' && (
                <div className="categories-grid">
                  <button
                    type="button"
                    className={`category-button none-button ${!this.props.Settings.focusedCategoryId && (!this.props.Settings.focusedSubstring || this.props.Settings.focusedSubstring.trim() === '') ? '-active' : ''} ${this.props.Settings.focusedSubstring && this.props.Settings.focusedSubstring.trim() !== '' ? '-faded' : ''}`}
                    onClick={() => {
                      this.props.SettingsActions.updateSetting('focusedCategoryId', null);
                      this.props.SettingsActions.updateSetting('focusedSubstring', '');
                    }}
                  >
                    <span>All Categories</span> <span className="n">({this.props.My.courses?.length || 0} courses)</span>
                  </button>

                  {this.getUserCategories().map(this.renderCategoryButton)}
                </div>
              )}

              {this.state.selectedTab === 'By Course Title' && (
                <div className="substring-filter">
                  {this.renderSavedCourseTitles()}
                  <div className="input-container">
                    <input
                      type="text"
                      className="standard-input -TextInput"
                      value={this.props.Settings.focusedSubstring || ''}
                      onChange={this.handleSubstringChange}
                      onFocus={this.handleInputFocus}
                      onBlur={this.handleInputBlur}
                      placeholder="Enter beginning of course title..."
                    />
                    {this.renderMatchingCourses()}
                  </div>
                </div>
              )}
            </div>
          </div>

          <section className="buttons">
            <button
              type="button"
              className="button -white"
              onClick={() => this.handleSave(closeModal)}
            >
              Save
            </button>
          </section>
        </div>
      </section>
    )}</TogglerAndModal>
}

export default FocusModeModal;