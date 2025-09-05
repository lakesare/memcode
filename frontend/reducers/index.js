import { combineReducers } from 'redux';

// global state
import { AuthenticationReducer } from '~/reducers/Authentication';
import MyDuck from '~/ducks/MyDuck';
import NotificationsDuck from '~/ducks/NotificationsDuck';

// per-page state
// [named like: page component name + _Reducer]
// logic of naming is that _courses_id_review_ in the middle originates from url, and should be left alone from our usual camelCase.
import Page_courses_id_review_Reducer from '~/pages/courses_id_review/duck/reducer';

const reducers = combineReducers({
  // global state
  global: combineReducers({
    Authentication: AuthenticationReducer,
    Notifications: NotificationsDuck.reducer,
    My: MyDuck.reducer,
  }),

  // per-page state
  pages: combineReducers({
    Page_courses_id_review: Page_courses_id_review_Reducer
  })
});

export default reducers;
