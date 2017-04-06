import * as Spe from '~/services/spe';
import Immutable from 'immutable';

const initialState = {
  speGetCourse: {},
  speCourseUserIsLearning: {}
};

const CourseActionsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SEED_SPE_GET_COURSE': {
      const spe = action.payload;
      if (spe.status === 'success') {
        return {
          ...state,
          speGetCourse: spe,
          speCourseUserIsLearning: Spe.success(spe.payload.courseUserIsLearning)
        };
      } else {
        return {
          ...state,
          speGetCourse: spe
        };
      }
    }
    case 'SEED_SPE_COURSE_USER_IS_LEARNING':
      return {
        ...state,
        speCourseUserIsLearning: action.payload
      };
    case 'CHANGE_AMOUNT_OF_PROBLEMS_TO_REVIEW_BY':
      return Immutable.fromJS(state)
        .updateIn(
          ['speGetCourse', 'payload', 'amountOfProblemsToReview'],
          amount => amount + action.payload
        )
        .toJS();
    case 'CHANGE_AMOUNT_OF_PROBLEMS_TO_LEARN_BY':
      return Immutable.fromJS(state)
        .updateIn(
          ['speGetCourse', 'payload', 'amountOfProblemsToLearn'],
          amount => amount + action.payload
        )
        .toJS();
    default:
      return state;
  }
};

export {
  CourseActionsReducer
};
