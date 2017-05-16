// we are putting all per-page get routes here, because they don't really tend to belong to certain components.
// for the single page we may want to fetch may things, for example: course, courseUserIsLearning, and problems.
// we will only want GET routes here, as deletes and updates tend to only concern one component at a time.
import express from 'express';
const router = express.Router();

import { catchAsync } from '~/services/catchAsync';
import { authenticateMiddleware } from '~/middlewares/authenticate';

import * as CourseUserIsLearning from '~/components/coursesUserIsLearning/model';
import * as Course from '~/components/courses/model';
import * as Problem from '~/components/problems/model';

router.get('/courses/:id/learn', authenticateMiddleware, catchAsync(async (request, response) => {
  const courseId = request.params['id'];

  const courseUserIsLearning = await CourseUserIsLearning.select.oneByCourseIdAndUserId(courseId, request.currentUser.id);
  const problems = await CourseUserIsLearning.select.problemsToLearn(courseUserIsLearning.id);

  response.status(200).json({ courseUserIsLearning, problems });
}));

router.get('/courses/:id/review', authenticateMiddleware, catchAsync(async (request, response) => {
  const courseId = request.params['id'];
  // we get 'true'/'false', and parse it into the actual true/false.
  const ifSimulated = JSON.parse(request.query.ifSimulated);

  const courseUserIsLearning = await CourseUserIsLearning.select.oneByCourseIdAndUserId(courseId, request.currentUser.id);
  const problems =
    ifSimulated ?
    await Problem.select.allByCourseId(courseUserIsLearning.courseId) :
    await CourseUserIsLearning.select.problemsToReview(courseUserIsLearning.id);

  response.status(200).json({ courseUserIsLearning, problems });
}));

router.get('/courses/:id/edit', authenticateMiddleware, catchAsync(async (request, response) => {
  const courseId = request.params['id'];

  const course = await Course.select.oneById(courseId);
  const problems = await Problem.select.allByCourseId(courseId);

  response.status(200).json({ course, problems });
}));

router.get('/courses/:id', catchAsync(async (request, response) => {
  const courseId = request.params['id'];

  const problems = await Problem.select.allByCourseId(courseId);

  response.status(200).json(problems);
}));

router.get('/courseActions/:courseId/authenticated', authenticateMiddleware, catchAsync(async (request, response) => {
  const course = await Course.select.oneForActions(request.params.courseId, request.currentUser.id);
  response.status(200).json(course);
}));

router.get('/courseActions/:courseId/unauthenticated', catchAsync(async (request, response) => {
  const course = await Course.select.oneById(request.params.courseId);
  response.status(200).json({ course });
}));

export { router };
