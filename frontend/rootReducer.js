import { combineReducers } from 'redux';

import { reducer as formReducer } from 'redux-form';

import { problemsReducer } from './components/problems';
import { coursesReducer }  from './components/courses';
import { authReducer }  from './components/auth';

const rootReducer = combineReducers({
  problems: problemsReducer,
  courses:  coursesReducer,
  auth:     authReducer,
  form:     formReducer
});

export { rootReducer };

