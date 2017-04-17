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

  const courseUserIsLearning = await CourseUserIsLearning.select.oneByCourseIdAndUserId(courseId, request.currentUser.id);
  const problems = await CourseUserIsLearning.select.problemsToReview(courseUserIsLearning.id);

  response.status(200).json({ courseUserIsLearning, problems });
}));

router.get('/courses/:id/edit', authenticateMiddleware, catchAsync(async (request, response) => {
  const courseId = request.params['id'];

  const course = await Course.select.oneById(courseId);
  const problems = await Problem.select.allByCourseId(courseId);

  response.status(200).json({ course, problems });
}));

router.get('/courses/:id', authenticateMiddleware, catchAsync(async (request, response) => {
  const courseId = request.params['id'];

  const course = await Course.select.oneById(courseId);
  const problems = await Problem.select.allByCourseId(courseId);

  response.status(200).json({ course, problems });
}));

export { router };
