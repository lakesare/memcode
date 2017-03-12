import { combineReducers } from 'redux';

// global state
import { authenticationReducer } from './ducks/authentication';

// per-page state (named like page component lowercased + _reducer)
import { page_courses_id_solve_reducer } from './pages/courses_id_solve/reducer';

const rootReducer = combineReducers({
  authentication: authenticationReducer,
  page_courses_id_solve: page_courses_id_solve_reducer
});

export { rootReducer };
