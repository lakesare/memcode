import { combineReducers } from 'redux';

// global state
import { AuthenticationReducer } from '~/reducers/Authentication';

// per-component state
// [named like: component name + Reducer]
import { CourseActionsReducer } from '~/components/CourseActions/reducer';

// per-page state
// [named like: page component name + _Reducer]
// logic of naming is that _courses_id_review_ in the middle originates from url, and should be left alone from our usual camelCase.
import { Page_courses_id_review_Reducer } from '~/pages/courses_id_review/reducer';

const RootReducer = combineReducers({
  // global state
  global: combineReducers({
    Authentication: AuthenticationReducer,
  }),

  // per-component state
  components: combineReducers({
    CourseActions: CourseActionsReducer,
  }),

  // per-page state
  pages: combineReducers({
    Page_courses_id_review: Page_courses_id_review_Reducer,
  })
});

export { RootReducer };
