import express from 'express';
const router = express.Router();

import catchAsync from '~/services/catchAsync';
import authenticate from '~/middlewares/authenticate';

import knex from '~/db/knex';

import CourseUserIsLearningModel from '~/models/CourseUserIsLearningModel';
import ProblemUserIsLearningModel from '~/models/ProblemUserIsLearningModel';

const getProblemsByCourseId = (courseId) =>
  knex('problem').where({ course_id: courseId })
    // Put position-0 last (because it means they were created after the latest reordering!) (https://stackoverflow.com/a/3130216/3192470)
    .orderByRaw('position=0')
    .orderBy('position')
    .orderBy('createdAt', 'asc');

router.get('/courses/:id/learn', authenticate, catchAsync(async (request, response) => {
  const courseId = request.params['id'];

  // find cuil
  const courseUserIsLearning = await CourseUserIsLearningModel.select.oneByCourseIdAndUserId(courseId, request.currentUser.id);

  // find problems
  const problems = await getProblemsByCourseId(courseId);
  const problemUserIsLearnings = await ProblemUserIsLearningModel.select.allByCuilId(courseUserIsLearning.id);

  response.status(200).json({ courseUserIsLearning, problems, problemUserIsLearnings });
}));

router.get('/courses/:id/review', authenticate, catchAsync(async (request, response) => {
  const courseId = request.params['id'];

  const courseUserIsLearning = await CourseUserIsLearningModel.select.oneByCourseIdAndUserId(courseId, request.currentUser.id);
  const problems = await CourseUserIsLearningModel.select.problemsToReview(courseUserIsLearning.id);
  response.status(200).json({ courseUserIsLearning, problems });
}));

router.get('/courses/:id/review/simulated', catchAsync(async (request, response) => {
  const courseId = request.params['id'];
  const problems = await getProblemsByCourseId(courseId);
  response.status(200).json({ courseUserIsLearning: null, problems });
}));

router.get('/courses/:id', catchAsync(async (request, response) => {
  const courseId = request.params['id'];

  const problems = await getProblemsByCourseId(courseId);

  response.status(200).json({ problems });
}));

// global state (?)
router.get('/idsOfProblemsToLearnAndReviewPerCourse', authenticate, catchAsync(async (request, response) => {
  const idsOfProblemsToLearnAndReviewPerCourse = await CourseUserIsLearningModel.select.idsOfProblemsToLearnAndReviewPerCourse(request.currentUser.id);
  response.status(200).json(idsOfProblemsToLearnAndReviewPerCourse);
}));


import getForCourseActions from './getForCourseActions';
router.getForCourseActions = getForCourseActions;

import getUserPage from './getUserPage';
router.getUserPage = getUserPage;

export default router;
