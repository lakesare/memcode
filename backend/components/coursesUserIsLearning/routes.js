import express from 'express';
const router = express.Router();

import { catchAsync } from '~/services/catchAsync';
import { authenticateMiddleware } from '~/middlewares/authenticate';

import * as CourseUserIsLearning from './model';
import * as ProblemUserIsLearning from '~/components/problemsUserIsLearning/model';

router.post('/', authenticateMiddleware, catchAsync(async (request, response) => {
  const courseUserIsLearning = await CourseUserIsLearning.insert.create({
    courseId: request.body['courseId'],
    userId: request.currentUser.id,
    active: true
  });
  response.status(200).json(courseUserIsLearning);
}));

router.put('/:id/resumeLearning', catchAsync(async (request, response) => {
  const courseUserIsLearning = await CourseUserIsLearning.update.ifActive(request.params['id'], true);
  response.status(200).json(courseUserIsLearning);
}));

router.put('/:id/stopLearning', catchAsync(async (request, response) => {
  const courseUserIsLearning = await CourseUserIsLearning.update.ifActive(request.params['id'], false);
  response.status(200).json(courseUserIsLearning);
}));

router.put('/:id/problems/:problemId/review', authenticateMiddleware, catchAsync(async (request, response) => {
  await ProblemUserIsLearning.update.review(
    request.params['id'],
    request.params['problemId'],
    request.body['performanceRating']
  );
  response.status(200).json({});
}));

router.post('/:id/problems/:problemId/learn', authenticateMiddleware, catchAsync(async (request, response) => {
  const puil = await ProblemUserIsLearning.insert.create({
    courseUserIsLearningId: request.params['id'],
    problemId: request.params['problemId']
  });
  response.status(200).json(puil);
}));

export { router };
