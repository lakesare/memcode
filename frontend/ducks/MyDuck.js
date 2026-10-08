import dayjs from 'dayjs';
import getNextScore from '~/../services/getNextScore';
import repetitions from '~/../services/repetitions';
import initialScore from '~/../services/initialScore';
import withOfflineFallback from '~/services/offline/withOfflineFallback';
import offlineFallbacks from '~/services/offline/fallbacks';
import OfflineDuck from '~/ducks/OfflineDuck';
import tempIds from '~/services/offline/tempIds';

const namespace = 'global.my';

const SPE_COURSES = `${namespace}.SPE_COURSES`;
const SPE_CATEGORIES = `${namespace}.SPE_CATEGORIES`;

const setProblem = (state, courseId, problemId, setFn) => ({
  ...state,
  courses: state.courses.map((courseDto) =>
    courseDto.course.id !== courseId ?
      courseDto :
      {
        ...courseDto,
        problems: courseDto.problems.map((problem) =>
          problem.id !== problemId ? problem : setFn(problem)
        )
      }
  )
});

const setSpeCourseForActionsPayload = (state, setFn) => ({
  ...state,
  speCourseForActions: {
    ...state.speCourseForActions,
    payload: setFn(state.speCourseForActions.payload)
  }
});


const initialState = {
  coursesAlreadyFetched: false,
  speCourses: {},
  courses: [],
  speCategories: {},
  speCourseForActions: {},
};
const reducer = (state = initialState, action) => {
  switch (action.type) {
    // SPE
    case SPE_CATEGORIES: {
      return { ...state, speCategories: action.spe };
    }
    case `${namespace}.SET`:
      return action.payload;
    case OfflineDuck.actionTypes.COURSE_CREATED: {
      const courseDto = action.payload;
      return {
        ...state,
        courses: [...state.courses.filter((dto) => dto.course.id !== courseDto.course.id), courseDto]
      };
    }
    case OfflineDuck.actionTypes.COURSE_UPDATED: {
      const { courseId, course, courseCategory } = action.payload;
      return {
        ...state,
        courses: state.courses.map((dto) =>
          dto.course.id !== courseId ?
            dto :
            {
              ...dto,
              course: {
                ...dto.course,
                title: course.title,
                description: course.description,
                if_public: course.ifPublic,
                course_category_id: course.courseCategoryId
              },
              courseCategory
            }
        )
      };
    }
    // [claude comment] mirrors ProblemApi.moveToCourseMany - the flashcards get new ids in the target course, and keep their learning progress
    case OfflineDuck.actionTypes.FLASHCARDS_MOVED: {
      const { sourceCourseId, targetCourseId, newIdsByOldId } = action.payload;
      const ifMoved = (problem) => newIdsByOldId[problem.id] !== undefined;
      const sourceDto = state.courses.find((dto) => dto.course.id === sourceCourseId);
      const movedProblems = sourceDto ? sourceDto.problems.filter(ifMoved) : [];

      return {
        ...state,
        courses: state.courses.map((dto) => {
          if (dto.course.id === sourceCourseId) {
            return { ...dto, problems: dto.problems.filter((problem) => !ifMoved(problem)) };
          } else if (dto.course.id === targetCourseId) {
            return {
              ...dto,
              problems: [
                ...dto.problems,
                ...movedProblems.map((problem) => ({ ...problem, id: newIdsByOldId[problem.id], courseId: targetCourseId }))
              ]
            };
          } else {
            return dto;
          }
        })
      };
    }
    // [claude comment] courses that changed on other devices or by coauthors (OfflineDuck.updateChangedCourses)
    case OfflineDuck.actionTypes.COURSES_UPDATED: {
      if (!state.coursesAlreadyFetched) return state;
      const { courseDtos, removedCourseIds } = action.payload;
      const updatedDtoById = new Map(courseDtos.map((dto) => [dto.course.id, dto]));
      const keptCourses = state.courses
        .filter((dto) => !removedCourseIds.includes(dto.course.id))
        .map((dto) => (updatedDtoById.has(dto.course.id) ? updatedDtoById.get(dto.course.id) : dto));
      const newCourses = courseDtos.filter((dto) => !state.courses.some((one) => one.course.id === dto.course.id));
      return { ...state, courses: [...keptCourses, ...newCourses] };
    }
    case OfflineDuck.actionTypes.TEMP_IDS_REPLACED: {
      const idMap = action.payload;
      return {
        ...state,
        courses: tempIds.replaceTempIds(state.courses, idMap),
        speCourseForActions: tempIds.replaceTempIds(state.speCourseForActions, idMap)
      };
    }
    case `${namespace}.SET_SPE_GET_COURSE`: {
      return { ...state, speCourseForActions: action.payload };
    }
    case `${namespace}.RESET_SPE_COURSES`: {
      return { ...state, speCourses: {} };
    }
    case SPE_COURSES: {
      if (action.spe.status === 'success') {
        return { ...state, speCourses: { status: 'success' }, courses: action.spe.payload, coursesAlreadyFetched: true };
      } else {
        return { ...state, speCourses: { status: 'request' } };
      }
    }
    // COURSES
    case `${namespace}.START_LEARNING_COURSE`: {
      const courseUserIsLearning = action.payload.courseUserIsLearning;

      return setSpeCourseForActionsPayload(state, (payload) => ({
        ...payload,
        amountOfLearners: payload.amountOfLearners + 1,
        courseUserIsLearning
      }));
    }
    case `${namespace}.STOP_LEARNING_COURSE`: {
      const courseUserIsLearning = action.payload.courseUserIsLearning;

      const stateWithoutCourse = {
        ...state,
        courses: state.courses.filter((courseDto) =>
          courseDto.course.id !== courseUserIsLearning.courseId
        )
      };

      return setSpeCourseForActionsPayload(stateWithoutCourse, (payload) => ({
        ...payload,
        courseUserIsLearning,
        amountOfLearners: payload.amountOfLearners - 1
      }));
    }
    case `${namespace}.RESUME_LEARNING_COURSE`: {
      const courseUserIsLearning = action.payload.courseUserIsLearning;

      return setSpeCourseForActionsPayload(state, (payload) => ({
        ...payload,
        courseUserIsLearning,
        amountOfLearners: payload.amountOfLearners + 1
      }));
    }
    // [claude comment] MyModel reads the review schedule off the dto, so mirror it there too
    case `${namespace}.UPDATE_COURSE_USER_IS_LEARNING`: {
      const courseUserIsLearning = action.payload.courseUserIsLearning;

      const stateWithNewSchedule = {
        ...state,
        courses: state.courses.map((courseDto) =>
          courseDto.course.id !== courseUserIsLearning.courseId ?
            courseDto :
            { ...courseDto, repeatEveryHours: courseUserIsLearning.repeatEveryHours }
        )
      };

      if (state.speCourseForActions.payload) {
        return setSpeCourseForActionsPayload(stateWithNewSchedule, (payload) => ({
          ...payload,
          courseUserIsLearning
        }));
      } else {
        return stateWithNewSchedule;
      }
    }
    // PROBLEM CRUD
    case `${namespace}.CREATE_PROBLEM`: {
      const courseId = action.payload.courseId;
      const problemId = action.payload.problemId;

      // We need to be using .amountOfProblems too, because people who don't yet learn the current course don't have My.courses data structure :-)
      const stateWithNewCount = setSpeCourseForActionsPayload(state, (payload) => ({
        ...payload,
        amountOfProblems: payload.amountOfProblems + 1
      }));

      return {
        ...stateWithNewCount,
        courses: stateWithNewCount.courses.map((courseDto) =>
          courseDto.course.id !== courseId ?
            courseDto :
            { ...courseDto, problems: [...courseDto.problems, { id: problemId, _learned: false }] }
        )
      };
    }
    case `${namespace}.DELETE_PROBLEM`: {
      const courseId = action.payload.courseId;
      const problemId = action.payload.problemId;

      const stateWithNewCount = setSpeCourseForActionsPayload(state, (payload) => ({
        ...payload,
        amountOfProblems: payload.amountOfProblems - 1
      }));

      return {
        ...stateWithNewCount,
        courses: stateWithNewCount.courses.map((courseDto) =>
          courseDto.course.id !== courseId ?
            courseDto :
            { ...courseDto, problems: courseDto.problems.filter((problem) => problem.id !== problemId) }
        )
      };
    }
    // PROBLEM REVIEW
    case `${namespace}.LEARN_PROBLEM`: {
      const courseId = action.payload.courseId;
      const problemId = action.payload.problemId;
      const newState = setProblem(state, courseId, problemId, (problem) => ({
        id: problem.id,
        _learned: true,
        ifIgnored: false,
        nextDueDate: dayjs().format(),
        // [claude comment] mirrors createPuil - learning isn't reviewing
        lastReviewedAt: null,
        easiness: initialScore().easiness,
        consecutiveCorrectAnswers: initialScore().consecutiveCorrectAnswers
      }));
      return newState;
    }
    case `${namespace}.IGNORE_PROBLEM`: {
      const courseId = action.payload.courseId;
      const problemId = action.payload.problemId;
      const newState = setProblem(state, courseId, problemId, (problem) => ({
        id: problem.id,
        _learned: true,
        ifIgnored: true,
        nextDueDate: dayjs().format(),
        lastReviewedAt: null,
        easiness: initialScore().easiness,
        consecutiveCorrectAnswers: initialScore().consecutiveCorrectAnswers
      }));
      return newState;
    }
    case `${namespace}.UNLEARN_UNIGNORE_PROBLEM`: {
      const courseId = action.payload.courseId;
      const problemId = action.payload.problemId;
      const newState = setProblem(state, courseId, problemId, (problem) => ({
        id: problem.id,
        _learned: false
      }));
      return newState;
    }
    case `${namespace}.REVIEW_PROBLEM`: {
      const courseId = action.payload.courseId;
      const problemId = action.payload.problemId;
      const score = action.payload.score;

      // [claude comment] mirrors ProblemUserIsLearningApi.reviewProblem, so the counts move before the api answers - a fixed-interval course keeps its own rhythm
      const courseDto = state.courses.find((dto) => dto.course.id === courseId);
      const repeatEveryHours = courseDto && courseDto.repeatEveryHours;

      const newState = setProblem(state, courseId, problemId, (problem) => {
        const newScore = getNextScore(problem.easiness, problem.consecutiveCorrectAnswers, score);
        const nextDueDate = repeatEveryHours ?
          repetitions.nextDueDateAfterReview(
            courseDto.problems.filter((one) => one._learned && !one.ifIgnored),
            problem,
            repeatEveryHours
          ) :
          dayjs().add(newScore.msToNextReview, 'ms').toDate();

        return {
          id: problem.id,
          _learned: true,
          ifIgnored: false,
          // [claude comment] to the millisecond - dayjs().format() rounds to whole seconds, which would leave the flashcard a hair inside the batch it was just reviewed out of
          nextDueDate: nextDueDate.toISOString(),
          lastReviewedAt: dayjs().format(),
          easiness: newScore.easiness,
          consecutiveCorrectAnswers: newScore.consecutiveCorrectAnswers
        };
      });
      return newState;
    }

    default:
      return state;
  }
};

import api from '~/api';

const getActions = (dispatch, getState) => ({
  apiGetCourses: () => {
    // const oldPayload = localStorage.getItem('idsOfProblemsToLearnAndReviewPerCourse');
    // if (oldPayload) {
    //   try {
    //     const parsedOldPayload = JSON.parse(oldPayload);
    //     dispatch({ type: `${namespace}.SET`, payload: parsedOldPayload });
    //   } catch (error) {
    //     console.error(error);
    //     console.log("Couldn't parse apiSync() payload from localStorage");
    //   }
    // }
    // [claude comment] reviews made offline get sent first, otherwise the server answers with the schedule from before them
    OfflineDuck.getActions(dispatch, getState).sendQueuedChanges()
      .catch(() => {})
      .then(() => withOfflineFallback(
        (spe) => dispatch({ type: SPE_COURSES, spe }),
        (dispatchSpe) => api.get.CourseApi.getMyEverything(dispatchSpe, {}),
        offlineFallbacks.getMyEverything
      ))
      .then(() => {
        setTimeout(() => {
          dispatch({ type: `${namespace}.RESET_SPE_COURSES` });
        }, 200);
      });
  },
  apiGetCategories: () => {
    withOfflineFallback(
      (spe) => dispatch({ type: SPE_CATEGORIES, spe }),
      (dispatchSpe) => api.get.CourseCategoryApi.getAll(dispatchSpe, {}),
      offlineFallbacks.getAllCategories
    );
  },
  apiGetCourseForActions: (courseId) => {
    // console.log(getState());
    const oldSpe = getState().global.My.speCourseForActions;
    const isAlreadyLoadedCourse =
      oldSpe.status === 'success' &&
      oldSpe.payload.course.id === courseId;

    if (!isAlreadyLoadedCourse) {
      withOfflineFallback(
        (spe) => dispatch({ type: `${namespace}.SET_SPE_GET_COURSE`, payload: spe }),
        (dispatchSpe) => api.get.PageApi.getForCourseActions(dispatchSpe, { courseId }),
        () => offlineFallbacks.getForCourseActions(courseId),
        { ifOnlyOffline: tempIds.isTempId(courseId) }
      );
    }
  },
  startLearningCourse: (courseUserIsLearning, currentUser) => {
    dispatch({ type: `${namespace}.START_LEARNING_COURSE`, payload: { courseUserIsLearning, currentUser } });
  },
  stopLearningCourse: (courseUserIsLearning, currentUser) => {
    dispatch({ type: `${namespace}.STOP_LEARNING_COURSE`, payload: { courseUserIsLearning, currentUser } });
  },
  resumeLearningCourse: (courseUserIsLearning, currentUser) => {
    dispatch({ type: `${namespace}.RESUME_LEARNING_COURSE`, payload: { courseUserIsLearning, currentUser } });
  },
  setSpeCourseForActions: (spe) => {
    dispatch({ type: `${namespace}.SET_SPE_GET_COURSE`, payload: spe });
  },
  reviewProblem: (courseId, problemId, score) => {
    dispatch({ type: `${namespace}.REVIEW_PROBLEM`, payload: { courseId, problemId, score } });
  },
  updateCourseUserIsLearning: (courseUserIsLearning) => {
    dispatch({ type: `${namespace}.UPDATE_COURSE_USER_IS_LEARNING`, payload: { courseUserIsLearning } });
  },
  createProblem: (courseId, problemId) => {
    dispatch({ type: `${namespace}.CREATE_PROBLEM`, payload: { courseId, problemId } });
  },
  deleteProblem: (courseId, problemId) => {
    dispatch({ type: `${namespace}.DELETE_PROBLEM`, payload: { courseId, problemId } });
  },
  learnProblem: (courseId, problemId) => {
    dispatch({ type: `${namespace}.LEARN_PROBLEM`, payload: { courseId, problemId } });
  },
  ignoreProblem: (courseId, problemId) => {
    dispatch({ type: `${namespace}.IGNORE_PROBLEM`, payload: { courseId, problemId } });
  },
  unlearnUnignoreProblem: (courseId, problemId) => {
    dispatch({ type: `${namespace}.UNLEARN_UNIGNORE_PROBLEM`, payload: { courseId, problemId } });
  },
});

const selectors = {};

export default { reducer, getActions, selectors };
