const initialState = {
  speGetCourse: {}
};

const CourseActionsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SEED_SPE_GET_COURSE': {
      return { ...state, speGetCourse: action.payload };
    }
    default:
      return state;
  }
};

export {
  CourseActionsReducer
};
