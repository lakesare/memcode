const namespace = 'global.settings';

const UPDATE_SETTING = `${namespace}.UPDATE_SETTING`;

// Helper function for parsing localStorage values
const parsePinnedCourseIdsFromLS = (pinnedCourseIds) => {
  return pinnedCourseIds ? JSON.parse(pinnedCourseIds) : [];
};

// Side effect functions for DOM manipulation
const sideEffects = {
  theme: (theme) => {
    const bodyEl = document.body;
    if (theme === 'bright') {
      bodyEl.classList.add("-bright-theme");
    } else {
      bodyEl.classList.remove("-bright-theme");
    }
  },
  
  hideSocialButtons: (hideSocialButtons) => {
    const bodyEl = document.body;
    if (hideSocialButtons) {
      bodyEl.classList.add('-hideSocialButtons');
    } else {
      bodyEl.classList.remove('-hideSocialButtons');
    }
  }
};

// Initial state loaded from localStorage
const initialState = {
  flashcardOrder: localStorage.getItem('flashcardOrder') === 'false' ? false : true,
  ifMonospace: localStorage.getItem('ifMonospace') === 'true' ? true : false,
  pinnedCourseIds: parsePinnedCourseIdsFromLS(localStorage.getItem('pinnedCourseIds')),
  backgroundImage:
    (localStorage.getItem('backgroundImage') &&
    localStorage.getItem('backgroundImage') !== 'false') ?
      localStorage.getItem('backgroundImage') : false,
  clozeDeletionMode: localStorage.getItem('clozeDeletionMode') === "clicking" ?
    "clicking" : "typing",
  theme: localStorage.getItem('theme') || 'dark',
  hideSocialButtons: localStorage.getItem('hideSocialButtons') === 'true' ? true : false,
  focusedCategoryId: localStorage.getItem('focusedCategoryId') ? parseInt(localStorage.getItem('focusedCategoryId'), 10) : null
};

// Reducer
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_SETTING: {
      const { key, value } = action.payload;
      return { ...state, [key]: value };
    }
    default:
      return state;
  }
};

// Action creators
const getActions = (dispatch) => ({
  updateSetting: (key, value) => {
    // Handle special cases for localStorage serialization
    let storageValue = value;
    if (key === 'pinnedCourseIds') {
      storageValue = JSON.stringify(value);
    }
    
    // Persist to localStorage
    localStorage.setItem(key, storageValue);
    
    // Apply side effects if any
    if (sideEffects[key]) {
      sideEffects[key](value);
    }
    
    // Dispatch Redux action
    dispatch({ type: UPDATE_SETTING, payload: { key, value } });
  },
  
  // Convenience methods for common operations
  toggleSetting: (key, currentValue) => {
    const actions = getActions(dispatch);
    actions.updateSetting(key, !currentValue);
  },
  
  addPinnedCourse: (courseId, currentIds) => {
    const safeCurrentIds = Array.isArray(currentIds) ? currentIds : [];
    const newIds = [...safeCurrentIds, courseId];
    
    // Persist to localStorage
    localStorage.setItem('pinnedCourseIds', JSON.stringify(newIds));
    
    // Dispatch Redux action
    dispatch({ type: UPDATE_SETTING, payload: { key: 'pinnedCourseIds', value: newIds } });
  },
  
  removePinnedCourse: (courseId, currentIds) => {
    const safeCurrentIds = Array.isArray(currentIds) ? currentIds : [];
    const newIds = safeCurrentIds.filter(id => id !== courseId);
    
    // Persist to localStorage
    localStorage.setItem('pinnedCourseIds', JSON.stringify(newIds));
    
    // Dispatch Redux action
    dispatch({ type: UPDATE_SETTING, payload: { key: 'pinnedCourseIds', value: newIds } });
  }
});

// Initialize side effects on app start
const initializeSideEffects = (settings) => {
  Object.keys(sideEffects).forEach(key => {
    if (settings[key] !== undefined) {
      sideEffects[key](settings[key]);
    }
  });
};

// Selectors
const selectors = {};

export default { reducer, getActions, selectors, initializeSideEffects };
