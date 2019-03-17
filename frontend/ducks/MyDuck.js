const namespace = 'global.my';

const API_REQUEST = `${namespace}.API_REQUEST`;
const API_SUCCESS = `${namespace}.API_SUCCESS`;
const API_FAILURE = `${namespace}.API_FAILURE`;

const initialState = {
  coursesUserIsLearning: [],
  courses: [],
  problems: [],
  problemsUserIsLearning: [],

  apiStatus: 'request', // success/request/failure
};
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case API_REQUEST:
      return { ...state, apiStatus: 'request' };
    case API_FAILURE:
      return { ...state, apiStatus: 'failure' };
    case API_SUCCESS:
      return {
        ...state,
        coursesUserIsLearning: action.payload.coursesUserIsLearning,
        courses: action.payload.courses,
        problems: action.payload.problems,
        problemsUserIsLearning: action.payload.problemsUserIsLearning,

        apiStatus: 'success'
      };
    default:
      return state;
  }
};

import api from '~/api';

const actions = {
  apiGet: (dispatch) => {
    dispatch({ type: API_REQUEST });
    api.CourseApi.getMyEverything()
      .then((payload) => {
        console.log(payload);
        dispatch({ type: API_SUCCESS, payload });
      })
      .catch((err) => {
        console.log(err);
        dispatch({ type: API_FAILURE });
      });
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
