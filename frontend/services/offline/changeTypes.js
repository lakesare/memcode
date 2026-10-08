import _ from 'lodash';
import initialScore from '../../../services/initialScore.js';
import storage from './storage.js';
import tempIds from './tempIds.js';

// [claude comment] every write that works offline: prepare() says what to answer while the server is unreachable, which temporary ids the server's answer replaces and which course the change belongs to (when the caller can't say), applyLocally() makes the change show up in the offline download

const updateLearnPage = (courseId, update) =>
  storage.updateResponse(`getLearnPage:${courseId}`, update);

const updatePuils = (courseId, update) =>
  updateLearnPage(courseId, (page) => ({ ...page, problemUserIsLearnings: update(page.problemUserIsLearnings) }));

const updateAmountOfProblems = (courseId, difference) =>
  storage.updateResponse(`getForCourseActions:${courseId}`, (payload) => ({
    ...payload, amountOfProblems: payload.amountOfProblems + difference
  }));

const preparePuil = async ({ problemId }, { courseId }, ifIgnored) => {
  const learnPage = await storage.getResponse(`getLearnPage:${courseId}`);
  const id = tempIds.generateTempId();
  return {
    localResult: {
      id,
      problemId,
      courseUserIsLearningId: learnPage ? learnPage.courseUserIsLearning.id : null,
      ifIgnored,
      easiness: initialScore().easiness,
      consecutiveCorrectAnswers: initialScore().consecutiveCorrectAnswers,
      nextDueDate: new Date().toISOString(),
      lastReviewedAt: null
    },
    tempIds: { [id]: 'id' }
  };
};

const addPuil = ({ problemId }, puil, { courseId }) =>
  updatePuils(courseId, (puils) => [...puils.filter((one) => one.problemId !== problemId), puil]);

const changeTypes = {
  'ProblemApi.create': {
    noticeWhenRefused: 'a new flashcard',
    prepare: async ({ problem }) => {
      const id = tempIds.generateTempId();
      return {
        localResult: { ...problem, id, createdAt: new Date().toISOString() },
        tempIds: { [id]: 'id' },
        courseId: problem.courseId
      };
    },
    applyLocally: async ({ problem }, createdProblem) => {
      await updateLearnPage(problem.courseId, (page) => ({
        ...page,
        problems: [
          ...page.problems,
          { position: Math.max(0, ...page.problems.map((one) => one.position)) + 1, ...createdProblem }
        ]
      }));
      await updateAmountOfProblems(problem.courseId, 1);
    }
  },

  'ProblemApi.update': {
    noticeWhenRefused: 'an edit of a flashcard',
    prepare: async () => ({ localResult: { ifOverwroteOtherEdit: false } }),
    applyLocally: ({ id, problem }, result, { courseId }) =>
      updateLearnPage(courseId, (page) => ({
        ...page,
        problems: page.problems.map((one) =>
          one.id === id ? { ...one, type: problem.type, content: problem.content } : one
        )
      }))
  },

  'ProblemApi.reorder': {
    noticeWhenRefused: 'a new order of flashcards',
    prepare: async () => ({ localResult: {} }),
    applyLocally: (positions, result, { courseId }) => {
      const positionById = new Map(positions.map(({ id, position }) => [id, position]));
      return updateLearnPage(courseId, (page) => ({
        ...page,
        problems: page.problems
          .map((one) => (positionById.has(one.id) ? { ...one, position: positionById.get(one.id) } : one))
          .sort((a, b) => a.position - b.position)
      }));
    }
  },

  'ProblemApi.moveToCourseMany': {
    noticeWhenRefused: 'flashcards moved to another course',
    prepare: async ({ problemIds }, { courseId }) => {
      const learnPage = await storage.getResponse(`getLearnPage:${courseId}`);
      const puils = learnPage ? learnPage.problemUserIsLearnings.filter((one) => problemIds.includes(one.problemId)) : [];

      const newIdsByOldId = {};
      const newPuilIdsByOldId = {};
      const tempIdPaths = {};
      problemIds.forEach((id) => {
        newIdsByOldId[id] = tempIds.generateTempId();
        tempIdPaths[newIdsByOldId[id]] = `newIdsByOldId.${id}`;
      });
      puils.forEach((puil) => {
        newPuilIdsByOldId[puil.id] = tempIds.generateTempId();
        tempIdPaths[newPuilIdsByOldId[puil.id]] = `newPuilIdsByOldId.${puil.id}`;
      });

      return { localResult: { newIdsByOldId, newPuilIdsByOldId }, tempIds: tempIdPaths };
    },
    applyLocally: async ({ problemIds, courseId: targetCourseId }, { newIdsByOldId, newPuilIdsByOldId }, { courseId: sourceCourseId, onFlashcardsMoved }) => {
      const sourcePage = await storage.getResponse(`getLearnPage:${sourceCourseId}`);
      if (!sourcePage) return;
      const ifMoved = (problemId) => problemIds.includes(problemId);
      const movedProblems = sourcePage.problems.filter((one) => ifMoved(one.id));
      const movedPuils = sourcePage.problemUserIsLearnings.filter((one) => ifMoved(one.problemId) && newPuilIdsByOldId[one.id]);

      await updateLearnPage(sourceCourseId, (page) => ({
        ...page,
        problems: page.problems.filter((one) => !ifMoved(one.id)),
        problemUserIsLearnings: page.problemUserIsLearnings.filter((one) => !ifMoved(one.problemId))
      }));
      await updateAmountOfProblems(sourceCourseId, -movedProblems.length);

      await updateLearnPage(targetCourseId, (page) => {
        const maxPosition = Math.max(0, ...page.problems.map((one) => one.position));
        return {
          ...page,
          problems: [
            ...page.problems,
            ...movedProblems.map((problem, index) => ({
              ...problem, id: newIdsByOldId[problem.id], courseId: targetCourseId, position: maxPosition + 1 + index
            }))
          ],
          problemUserIsLearnings: [
            ...page.problemUserIsLearnings,
            ...movedPuils.map((puil) => ({
              ...puil, id: newPuilIdsByOldId[puil.id], problemId: newIdsByOldId[puil.problemId], courseUserIsLearningId: page.courseUserIsLearning.id
            }))
          ]
        };
      });
      await updateAmountOfProblems(targetCourseId, movedProblems.length);

      onFlashcardsMoved({ sourceCourseId, targetCourseId, newIdsByOldId });
    }
  },

  'ProblemApi.deleteMany': {
    prepare: async () => ({ localResult: {} }),
    applyLocally: async ({ ids }, result, { courseId }) => {
      await updateLearnPage(courseId, (page) => ({
        ...page,
        problems: page.problems.filter((one) => !ids.includes(one.id)),
        problemUserIsLearnings: page.problemUserIsLearnings.filter((one) => !ids.includes(one.problemId))
      }));
      await updateAmountOfProblems(courseId, -ids.length);
    }
  },

  'CourseApi.createCourse': {
    noticeWhenRefused: 'a new course',
    prepare: async ({ course }, { currentUser }) => {
      const id = tempIds.generateTempId();
      const courseUserIsLearningId = tempIds.generateTempId();
      return {
        localResult: {
          id,
          title: course.title,
          userId: currentUser.id,
          description: course.description,
          ifPublic: course.ifPublic,
          createdAt: new Date().toISOString(),
          courseCategoryId: course.courseCategoryId,
          duplicatedFromCourseId: null,
          courseUserIsLearningId
        },
        tempIds: { [id]: 'id', [courseUserIsLearningId]: 'courseUserIsLearningId' },
        courseId: id
      };
    },
    applyLocally: async (body, createdCourse, { currentUser, onCourseCreated }) => {
      const { courseUserIsLearningId, ...course } = createdCourse;
      const categories = await storage.getResponse('getAllCategories');
      const foundCategory = categories && categories.courseCategories.find((one) => one.id === course.courseCategoryId);
      const courseCategory = foundCategory ? foundCategory : { id: course.courseCategoryId, name: '' };
      const courseUserIsLearning = {
        id: courseUserIsLearningId,
        active: true,
        courseId: course.id,
        userId: currentUser.id,
        startedLearningAt: course.createdAt,
        repeatEveryHours: null
      };

      await storage.putResponse(`getForCourseActions:${course.id}`, {
        course, author: currentUser, courseUserIsLearning, courseCategory,
        amountOfProblems: 0, coauthors: [], amountOfLearners: 1
      });
      await storage.putResponse(`getLearnPage:${course.id}`, {
        courseUserIsLearning, problems: [], problemUserIsLearnings: []
      });
      // [claude comment] same shape as one CourseApi.getMyEverything item, whose course comes snake_cased from row_to_json()
      await onCourseCreated({
        course: _.mapKeys(course, (value, key) => _.snakeCase(key)),
        author: currentUser,
        courseCategory,
        repeatEveryHours: null,
        problems: []
      });
    }
  },

  'CourseApi.updateCourse': {
    noticeWhenRefused: 'changes to the course details',
    prepare: async ({ courseId, course }) => {
      const forCourseActions = await storage.getResponse(`getForCourseActions:${courseId}`);
      const categories = await storage.getResponse('getAllCategories');
      const foundCategory = categories && categories.courseCategories.find((one) => one.id === Number(course.courseCategoryId));
      return {
        localResult: {
          course: {
            ...(forCourseActions ? forCourseActions.course : {}),
            title: course.title,
            description: course.description,
            // [claude comment] the public/private <Select/> gives 'true'/'false' strings
            ifPublic: course.ifPublic === true || course.ifPublic === 'true',
            courseCategoryId: Number(course.courseCategoryId)
          },
          courseCategory: foundCategory ? foundCategory : { id: Number(course.courseCategoryId), name: '' }
        },
        courseId
      };
    },
    applyLocally: async (body, { course, courseCategory }, { courseId, onCourseUpdated }) => {
      await storage.updateResponse(`getForCourseActions:${courseId}`, (payload) => ({ ...payload, course, courseCategory }));
      onCourseUpdated({ courseId, course, courseCategory });
    }
  },

  'ProblemUserIsLearningApi.learnProblem': {
    prepare: (body, context) => preparePuil(body, context, false),
    applyLocally: addPuil
  },

  'ProblemUserIsLearningApi.ignoreProblem': {
    prepare: (body, context) => preparePuil(body, context, true),
    applyLocally: addPuil
  },

  'ProblemUserIsLearningApi.ignoreAlreadyLearnedProblem': {
    prepare: async () => ({ localResult: {} }),
    applyLocally: ({ problemId }, result, { courseId }) =>
      updatePuils(courseId, (puils) => puils.map((one) => (one.problemId === problemId ? { ...one, ifIgnored: true } : one)))
  },

  'ProblemUserIsLearningApi.unlearnAlreadyLearnedProblem': {
    prepare: async () => ({ localResult: {} }),
    applyLocally: ({ problemId }, result, { courseId }) =>
      updatePuils(courseId, (puils) => puils.filter((one) => one.problemId !== problemId))
  },

  'ProblemUserIsLearningApi.unlearnUnignoreProblem': {
    prepare: async () => ({ localResult: {} }),
    applyLocally: ({ id }, result, { courseId }) =>
      updatePuils(courseId, (puils) => puils.filter((one) => one.id !== id))
  },

  // [claude comment] the new schedule is computed by MyDuck's REVIEW_PROBLEM, and the download keeps it through OfflineDuck.initializeSideEffects()
  'ProblemUserIsLearningApi.reviewProblem': {
    prepare: async () => ({ localResult: {}, reviewedAt: Date.now() }),
    applyLocally: async () => {}
  }
};

export default changeTypes;
