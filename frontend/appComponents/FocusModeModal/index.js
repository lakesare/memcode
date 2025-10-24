import TogglerAndModal from '~/components/TogglerAndModal';
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
    showMatchingCourses: false
  }


  handleCategorySelect = (categoryId) => {
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

  renderMatchingCourses = () => {
    const matchingCourses = this.getMatchingCourses();
    
    if (matchingCourses.length === 0) {
      return null;
    }

    return (
      <div className="matching-courses-list">
        {matchingCourses.map((course) => (
          <div key={course.course.id} className="course-item">
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
        className={`category-button ${this.ifCategoryIsActive(category.id) ? '-active' : ''} ${isSubstringActive ? '-disabled' : ''}`}
        onClick={() => this.handleCategorySelect(category.id)}
        disabled={isSubstringActive}
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
        </div>

        <div className="standard-modal__main">
          <div className="focus-content">
            <div className="setting">
              <div className="substring-filter">
                <label className="label">Filter by course title:</label>
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
                </div>
                {this.renderMatchingCourses()}
              </div>
              
              <div className="categories-grid">
                <button
                  type="button"
                  className={`category-button none-button ${!this.props.Settings.focusedCategoryId && (!this.props.Settings.focusedSubstring || this.props.Settings.focusedSubstring.trim() === '') ? '-active' : ''} ${this.props.Settings.focusedSubstring && this.props.Settings.focusedSubstring.trim() !== '' ? '-disabled' : ''}`}
                  onClick={() => {
                    this.props.SettingsActions.updateSetting('focusedCategoryId', null);
                    this.props.SettingsActions.updateSetting('focusedSubstring', '');
                  }}
                  disabled={this.props.Settings.focusedSubstring && this.props.Settings.focusedSubstring.trim() !== ''}
                >
                  <span>All Categories</span> <span className="n">({this.props.My.courses?.length || 0} courses)</span>
                </button>
                
                {this.getUserCategories().map(this.renderCategoryButton)}
              </div>
            </div>
          </div>

          <section className="buttons">
            <button
              type="button"
              className="button -white"
              onClick={closeModal}
            >
              Save
            </button>
          </section>
        </div>
      </section>
    )}</TogglerAndModal>
}

export default FocusModeModal;