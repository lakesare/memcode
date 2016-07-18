import { combineReducers } from 'redux';

import { problemsReducer } from './components/problems';
import { answersReducer }  from './components/answers';
import { coursesReducer }  from './components/courses';

const rootReducer = combineReducers({
  problems: problemsReducer,
  answers:  answersReducer,
  courses:  coursesReducer
});

export { rootReducer };

