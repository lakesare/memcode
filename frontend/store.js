import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { RootReducer } from './RootReducer.js';

const store = createStore(
  RootReducer,
  compose(
    applyMiddleware(thunk),
    window.devToolsExtension ?
      window.devToolsExtension() :
      f => f
  )
);

export default store;
