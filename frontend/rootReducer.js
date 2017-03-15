import { combineReducers } from 'redux';

// global state
import { authenticationReducer } from './ducks/authentication';

// per-page state (named like page component lowercased + _reducer)
import { page_courses_id_review_reducer } from './pages/courses_id_review/reducer';

const rootReducer = combineReducers({
  authentication: authenticationReducer,
  page_courses_id_review: page_courses_id_review_reducer
});

export { rootReducer };
