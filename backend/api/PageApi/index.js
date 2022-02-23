import express from 'express';
const router = express.Router();

import knex from '~/db/knex';
import catchAsync from '~/services/catchAsync';
import authenticate from '~/middlewares/authenticate';
import canAccessCourse from '~/services/canAccessCourse';
import CourseUserIsLearningModel from '~/models/CourseUserIsLearningModel';
import ProblemUserIsLearningModel from '~/models/ProblemUserIsLearningModel';
import getProblemsByCourseId from '~/api/services/getProblemsByCourseId';

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
  const problems = await CourseUserIsLearningModel.select.problemsToReview(courseUserIsLearning.id);
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

import getForCourseActions from './getForCourseActions';
router.getForCourseActions = getForCourseActions;

import getUserPage from './getUserPage';
router.getUserPage = getUserPage;

import getReviewPage from './getReviewPage';
router.getReviewPage = getReviewPage;

import getAllPage from './getAllPage';
router.getAllPage = getAllPage;

export default router;
