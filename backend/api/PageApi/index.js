import express from 'express';
const router = express.Router();

import knex from '~/db/knex';
import catchAsync from '~/services/catchAsync';
import authenticate from '~/middlewares/authenticate';
import canAccessCourse from '~/services/canAccessCourse';
import CourseUserIsLearningModel from '~/models/CourseUserIsLearningModel';
import ProblemUserIsLearningModel from '~/models/ProblemUserIsLearningModel';

// Todo move these somewhere when PageApi.js is refactored, likely to the middleware
const cantAccessError = "Sorry, this course is private. Only the author and coauthors and can access it.";

const getProblemsByCourseId = (courseId) =>
  knex('problem').where({ course_id: courseId })
    // Put position-0 last (because it means they were created after the latest reordering!) (https://stackoverflow.com/a/3130216/3192470)
    .orderByRaw('position=0')
    .orderBy('position')
    .orderBy('createdAt', 'asc');

router.get('/courses/:id/learn', authenticate, catchAsync(async (request, response) => {
  const courseId = request.params['id'];

  if (!(await canAccessCourse(courseId, request.currentUser))) {
    return response.error(cantAccessError);
  }

  // find cuil
  const courseUserIsLearning = await CourseUserIsLearningModel.select.oneByCourseIdAndUserId(courseId, request.currentUser.id);

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

  const courseUserIsLearning = await CourseUserIsLearningModel.select.oneByCourseIdAndUserId(courseId, request.currentUser.id);
  const problems = await CourseUserIsLearningModel.select.problemsToReview(courseUserIsLearning.id);
  response.status(200).json({ courseUserIsLearning, problems });
}));

router.get('/courses/:id/review/persistent', authenticate, catchAsync(async (request, response) => {
  const courseId = request.params['id'];

  if (!(await canAccessCourse(courseId, request.currentUser))) {
    return response.error(cantAccessError);
  }

  const problems = await getProblemsByCourseId(courseId);
  response.status(200).json({ courseUserIsLearning: null, problems });
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

export default router;
