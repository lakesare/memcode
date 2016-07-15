import { combineReducers } from 'redux';
import { problemsReducer } from './components/problems/reducer.js';
import { answersReducer } from './components/answers/reducer.js';

const rootReducer = combineReducers({
  problems: problemsReducer,
  answers:  answersReducer
});

export { rootReducer };

