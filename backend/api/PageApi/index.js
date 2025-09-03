import express from 'express';
const router = express.Router();

import knex from '#~/db/knex.js';
import catchAsync from '#~/services/catchAsync.js';
import authenticate from '#~/middlewares/authenticate.js';
import canAccessCourse from '#~/services/canAccessCourse.js';
import courseUserIsLearningModel from '#~/models/CourseUserIsLearningModel/select/index.js';
import ProblemUserIsLearningModel from '#~/models/ProblemUserIsLearningModel/index.js'
import getProblemsByCourseId from '#~/api/services/getProblemsByCourseId.js';

// Todo move these somewhere when PageApi.js is refactored, likely to the middleware
const cantAccessError = "Sorry, this course is private. Only the author and coauthors and can access it.";

const getLearnedProblemsByCuilId = (cuilId) =>
  knex('problem').select('problem.*')
    .innerJoin('problemUserIsLearning', { 'problemUserIsLearning.problemId': 'problem.id' })
    .where({
      'problemUserIsLearning.courseUserIsLearningId': cuilId,
      'problemUserIsLearning.ifIgnored': false
    })
    .orderBy('problem.position', 'asc')
    .orderBy('problem.createdAt', 'asc');

router.get('/courses/:id/learn', authenticate, catchAsync(async (request, response) => {
  const courseId = request.params['id'];

  if (!(await canAccessCourse(courseId, request.currentUser))) {
    return response.error(cantAccessError);
  }

  // find cuil
  const courseUserIsLearning = (await knex('courseUserIsLearning')
    .where({ courseId, userId: request.currentUser.id }))[0];

  // find problems
  const problems = await getProblemsByCourseId(courseId);
  const problemUserIsLearnings = await ProblemUserIsLearningModel.select.allByCuilId(courseUserIsLearning.id);

  response.status(200).json({ courseUserIsLearning, problems, problemUserIsLearnings });
}));

router.get('/courses/:id/review', authenticate, catchAsync(async (request, response) => {
  const courseId = request.params['id'];

  if (!(await canAccessCourse(courseId, request.currentUser))) {
    return response.error(cantAccessError);
  }

  const courseUserIsLearning = (await knex('courseUserIsLearning')
    .where({ courseId, userId: request.currentUser.id }))[0];
  const problems = await courseUserIsLearningModel.selectReview(courseUserIsLearning.id);

  response.status(200).json({ courseUserIsLearning, problems });
}));

router.get('/courses/:id/review/persistent', authenticate, catchAsync(async (request, response) => {
  const courseId = request.params['id'];

  if (!(await canAccessCourse(courseId, request.currentUser))) {
    return response.error(cantAccessError);
  }

  const courseUserIsLearning = (await knex('courseUserIsLearning')
    .where({ courseId, userId: request.currentUser.id }))[0];
  const problems = await getLearnedProblemsByCuilId(courseUserIsLearning.id);
  response.status(200).json({ courseUserIsLearning, problems });
}));

router.get('/courses/:id/review/simulated', catchAsync(async (request, response) => {
  const courseId = request.params['id'];

  if (!(await canAccessCourse(courseId, request.currentUser))) {
    return response.error(cantAccessError);
  }

  const problems = await getProblemsByCourseId(courseId);
  response.status(200).json({ courseUserIsLearning: null, problems });
}));

router.get('/courses/:id', catchAsync(async (request, response) => {
  const courseId = request.params['id'];

  if (!(await canAccessCourse(courseId, request.currentUser))) {
    return response.error(cantAccessError);
  }

  const problems = await getProblemsByCourseId(courseId);

  response.status(200).json({ problems });
}));

import getForCourseActions from './getForCourseActions.js';
router.getForCourseActions = getForCourseActions;

import getUserPage from './getUserPage.js';
router.getUserPage = getUserPage;

import getReviewPage from './getReviewPage.js';
router.getReviewPage = getReviewPage;

import getAllPage from './getAllPage.js';
router.getAllPage = getAllPage;

export default router;
