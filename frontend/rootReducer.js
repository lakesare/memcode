import { combineReducers } from 'redux';

import { reducer as formReducer } from 'redux-form';

import { problemsReducer } from './components/problems';
import { coursesReducer }  from './components/courses';

import { authenticationReducer } from './ducks/authentication';

const rootReducer = combineReducers({
  problems: problemsReducer,
  courses:  coursesReducer,
  authentication: authenticationReducer,
  form:     formReducer
});

export { rootReducer };

