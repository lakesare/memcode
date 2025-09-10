import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import reducers from './reducers';
import SettingsDuck from '~/ducks/SettingsDuck';
// import { offline } from '@redux-offline/redux-offline';
// import config from '@redux-offline/redux-offline/lib/config';

const store = createStore(
  reducers,
  compose(
    applyMiddleware(thunk),
    // offline(config),
    window.__REDUX_DEVTOOLS_EXTENSION__ ?
      window.__REDUX_DEVTOOLS_EXTENSION__() :
      f => f
  )
);

// Initialize side effects based on current settings state
SettingsDuck.initializeSideEffects(store.getState().global.Settings);

export default store;
