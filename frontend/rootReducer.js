import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import { problemsReducer } from './components/problems';
import { coursesReducer }  from './components/courses';

const rootReducer = combineReducers({
  problems: problemsReducer,
  courses:  coursesReducer,
  form:     formReducer
});

export { rootReducer };

