import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import { thunk } from 'redux-thunk';

// global state
import AuthenticationDuck from '~/ducks/AuthenticationDuck';
import MyDuck from '~/ducks/MyDuck';
import NotificationsDuck from '~/ducks/NotificationsDuck';
import SettingsDuck from '~/ducks/SettingsDuck';
import FailedFlashcardsDuck from '~/ducks/FailedFlashcardsDuck';
import OfflineDuck from '~/ducks/OfflineDuck';

// per-page state
// [named like: page component name + _Reducer]
// logic of naming is that _courses_id_review_ in the middle originates from url, and should be left alone from our usual camelCase.
import Page_courses_id_review_Reducer from '~/pages/courses_id_review/duck/reducer';

const reducers = combineReducers({
  // global state
  global: combineReducers({
    Authentication: AuthenticationDuck.reducer,
    Notifications: NotificationsDuck.reducer,
    My: MyDuck.reducer,
    Settings: SettingsDuck.reducer,
    FailedFlashcards: FailedFlashcardsDuck.reducer,
    Offline: OfflineDuck.reducer,
  }),

  // per-page state
  pages: combineReducers({
    Page_courses_id_review: Page_courses_id_review_Reducer
  })
});

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
OfflineDuck.initializeSideEffects(store);

export default store;
