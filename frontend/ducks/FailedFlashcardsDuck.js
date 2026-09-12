// [claude comment] the pile of flashcards you got wrong, kept in localStorage only - it survives a refresh, and deliberately doesn't follow you onto another device

const namespace = 'global.failedFlashcards';

const SET_PROBLEM_IDS = `${namespace}.SET_PROBLEM_IDS`;

const storageKey = 'failedProblemIdsPerCourse';

const readProblemIdsPerCourse = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(storageKey));
    return (stored && typeof stored === 'object') ? stored : {};
  } catch {
    return {};
  }
};

const initialState = {
  problemIdsPerCourse: readProblemIdsPerCourse()
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_PROBLEM_IDS:
      return { ...state, problemIdsPerCourse: action.payload };
    default:
      return state;
  }
};

const getProblemIds = (FailedFlashcards, courseId) => {
  const problemIds = FailedFlashcards.problemIdsPerCourse[courseId];
  return problemIds ? problemIds : [];
};

const getActions = (dispatch, getState) => {
  const setProblemIds = (courseId, problemIds) => {
    const problemIdsPerCourse = {
      ...getState().global.FailedFlashcards.problemIdsPerCourse,
      [courseId]: problemIds
    };

    localStorage.setItem(storageKey, JSON.stringify(problemIdsPerCourse));
    dispatch({ type: SET_PROBLEM_IDS, payload: problemIdsPerCourse });
  };

  return {
    addProblem: (courseId, problemId) => {
      const problemIds = getProblemIds(getState().global.FailedFlashcards, courseId);
      if (problemIds.includes(problemId)) {
        return;
      } else {
        setProblemIds(courseId, [...problemIds, problemId]);
      }
    },

    removeProblem: (courseId, problemId) => {
      const problemIds = getProblemIds(getState().global.FailedFlashcards, courseId);
      if (problemIds.includes(problemId)) {
        setProblemIds(courseId, problemIds.filter((one) => one !== problemId));
      } else {
        return;
      }
    }
  };
};

export default { reducer, getActions, getProblemIds };
