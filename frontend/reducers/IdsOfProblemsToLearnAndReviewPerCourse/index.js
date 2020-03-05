const namespace = 'global.IdsOfProblemsToLearnAndReviewPerCourse';

const whereIsProblem = (state, problemId) => {
  const courseIds = Object.keys(state);
  for (let i = 0; i !== courseIds.length; i++) {
    const courseId = courseIds[i];
    if (state[courseId]['toLearn'].includes(problemId)) {
      return { courseId, where: 'toLearn' };
    } else if (state[courseId]['toReview'].includes(problemId)) {
      return { courseId, where: 'toReview' };
    }
  }
  // if haven't found a problem and returned earlier - return now.
  return false;
};

// {
//   "4": {
//     "toReview": [14, 733],
//     "toLearn": []
//   }, ...
// }
const initialState = false;
const IdsOfProblemsToLearnAndReviewPerCourseReducer = (state = initialState, action) => {
  switch (action.type) {
    case `${namespace}.SET`:
      return action.payload;
    case `${namespace}.DELETE_PROBLEM`: {
      const problemId = action.payload.problemId;

      const where = whereIsProblem(state, problemId);
      if (where) {
        return {
          ...state,
          [where.courseId]: {
            ...state[where.courseId],
            [where.where]: state[where.courseId][where.where].filter((id) => id !== problemId)
          }
        };
      } else {
        return state;
      }
    }
    case `${namespace}.CREATE_PROBLEM`: {
      const courseId = action.payload.courseId;
      const problemId = action.payload.problemId;

      // do nothing if we are not learning this course
      if (!state[courseId]) return state;
      // otherwise add to .toLearn
      return {
        ...state,
        [courseId]: {
          ...state[courseId],
          toLearn: [
            ...state[courseId].toLearn,
            problemId
          ]
        }
      };
    }
    case `${namespace}.STOP_LEARNING_COURSE`: {
      const courseId = action.payload.courseId;
      // ___why toString?
      // while objects always implicitly convert their keys to strings, object deconstructors don't!
      // omit value will be right, but stateWithoutCourseId will not get rid of its key if we do
      // const { [4]: omit, objectWithoutKey } = object;
      //
      //
      // it('weird shit', () => {
      //   const { [4]: omit, ...stateWithoutKey } = { '4': 'wow' };
      //   expect(omit).to.equal('wow');
      //   expect(stateWithoutKey.hasOwnProperty(4)).to.equal(true);
      // })
      //
      // it('weird shit', () => {
      //   const { ['4']: omit, ...stateWithoutKey } = { '4': 'wow' };
      //   expect(omit).to.equal('wow');
      //   expect(stateWithoutKey.hasOwnProperty(4)).to.equal(false);
      // })
      const { [courseId.toString()]: omit, ...stateWithoutCourseId } = state;
      return stateWithoutCourseId;
    }
    case `${namespace}.LEARN_PROBLEM`: {
      const problemId = action.payload.problemId;

      const where = whereIsProblem(state, problemId);
      return {
        ...state,
        [where.courseId]: {
          toLearn: state[where.courseId].toLearn.filter((id) => id !== problemId),
          toReview: [...state[where.courseId].toReview, problemId]
        }
      };
    }
    default:
      return state;
  }
};

import { commonFetch } from '~/api/commonFetch';

const actions = {
  apiSync: (dispatch) => {
    const oldPayload = localStorage.getItem('idsOfProblemsToLearnAndReviewPerCourse');
    if (oldPayload) {
      try {
        const parsedOldPayload = JSON.parse(oldPayload);
        dispatch({ type: `${namespace}.SET`, payload: parsedOldPayload });
      } catch (error) {
        console.error(error);
        console.log("Couldn't parse apiSync() payload from localStorage");
        console.log(oldPayload);
      }
    }
    return commonFetch(
      false,
      'GET', `/api/pages/idsOfProblemsToLearnAndReviewPerCourse`
    )
      .then((payload) => {
        dispatch({ type: `${namespace}.SET`, payload });
      });
  },
  // ___edit actions. We will do nothing if we call them while not learning this course.
  //
  // === reviewProblem, ignoreProblem
  deleteProblem: (dispatch, problemId) =>
    dispatch({
      type: `${namespace}.DELETE_PROBLEM`,
      payload: { problemId }
    }),
  createProblem: (dispatch, courseId, problemId) =>
    dispatch({
      type: `${namespace}.CREATE_PROBLEM`,
      payload: { courseId, problemId }
    }),

  // just remove id all together
  stopLearningCourse: (dispatch, courseId) =>
    dispatch({
      type: `${namespace}.STOP_LEARNING_COURSE`,
      payload: { courseId }
    }),
  // remove from learned, add to reviewed
  learnProblem: (dispatch, problemId) =>
    dispatch({
      type: `${namespace}.LEARN_PROBLEM`,
      payload: { problemId }
    })
  // startLearningCourse, // better refetch, we need more info from the database
  // createCourse,
  // deleteCourse: we'll just get redirected and we will automatically refresh
};

export {
  IdsOfProblemsToLearnAndReviewPerCourseReducer,
  actions as IdsOfProblemsToLearnAndReviewPerCourseActions
};
