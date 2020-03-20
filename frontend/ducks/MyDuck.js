const namespace = 'global.my';

const SPE_COURSES = `${namespace}.SPE_COURSES`;
const SPE_CATEGORIES = `${namespace}.SPE_CATEGORIES`;

const initialState = {
  speCourses: {},
  courses: [],
  speCategories: {},
  speCourseForActions: {}
};
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SEED_SPE_GET_COURSE': {
      return { ...state, speCourseForActions: action.payload };
    }
    case SPE_COURSES: {
      if (state.speCourses.status === 'success') {
        if (action.spe.status === 'success') {
          return { ...state, courses: action.spe.payload };
        } else {
          return state;
        }
      } else {
        if (action.spe.status === 'success') {
          return { ...state, speCourses: { ...action.spe, payload: null }, courses: action.spe.payload };
        } else {
          return { ...state, speCourses: { ...action.spe, payload: null } };
        }
      }
    }
    case SPE_CATEGORIES: {
      return { ...state, speCategories: action.spe };
    }
    default:
      return state;
  }
};

import api from '~/api';

const actions = {
  apiGetCourses: (dispatch) => {
    api.CourseApi.getMyEverything((spe) => dispatch({ type: SPE_COURSES, spe }));
  },
  apiGetCategories: (dispatch) => {
    api.CourseCategoryApi.getAll((spe) => dispatch({ type: SPE_CATEGORIES, spe }));
  },
  apiGetCourseForActions: (courseId) => (dispatch, getState) => {
    // console.log(getState());
    const oldSpe = getState().global.My.speCourseForActions;
    const isAlreadyLoadedCourse =
      oldSpe.status === 'success' &&
      oldSpe.payload.course.id.toString() === courseId;

    if (!isAlreadyLoadedCourse) {
      api.PageApi.getForCourseActions(
        (spe) => dispatch({ type: 'SEED_SPE_GET_COURSE', payload: spe }),
        { courseId }
      );
    }
  }
  // deleteProblem: (dispatch, problemId) =>
  //   dispatch({
  //     type: `${namespace}.DELETE_PROBLEM`,
  //     payload: { problemId }
  //   }),
  // createProblem: (dispatch, courseId, problemId) =>
  //   dispatch({
  //     type: `${namespace}.CREATE_PROBLEM`,
  //     payload: { courseId, problemId }
  //   })
};

// import { createSelector } from 'reselect'

// const getVisibilityFilter = (state) => state.visibilityFilter
// const getTodos = (state) => state.todos


// export const getVisibleTodos = createSelector(
//   [getVisibilityFilter, getTodos],
//   (visibilityFilter, todos) => {
//     switch (visibilityFilter) {
//       case 'SHOW_ALL':
//         return todos
//       case 'SHOW_COMPLETED':
//         return todos.filter(t => t.completed)
//       case 'SHOW_ACTIVE':
//         return todos.filter(t => !t.completed)
//     }
//   }
// )

const selectors = {};

export default { reducer, actions, selectors };
