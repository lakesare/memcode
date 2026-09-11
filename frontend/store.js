import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import reducers from './reducers';
import SettingsDuck from '~/ducks/SettingsDuck';

const store = createStore(
  reducers,
  compose(
    applyMiddleware(thunk),
    window.__REDUX_DEVTOOLS_EXTENSION__ ?
      window.__REDUX_DEVTOOLS_EXTENSION__() :
      f => f
  )
);

// Initialize side effects based on current settings state
SettingsDuck.initializeSideEffects(store.getState().global.Settings);

export default store;
