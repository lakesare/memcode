import { combineReducers } from 'redux';

import { reducer as formReducer } from 'redux-form';

import { authenticationReducer } from './ducks/authentication';

const rootReducer = combineReducers({
  authentication: authenticationReducer,
  form:     formReducer
});

export { rootReducer };

