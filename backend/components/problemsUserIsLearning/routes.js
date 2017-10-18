import express from 'express';
const router = express.Router();

import { catchAsync } from '~/services/catchAsync';
import { authenticateMiddleware } from '~/middlewares/authenticate';

import * as Problem from '~/components/problems/model';
import * as CourseUserIsLearning from '~/components/coursesUserIsLearning/model';
import * as ProblemUserIsLearning from './model';

router.post('/', authenticateMiddleware, catchAsync(async (request, response) => {
  const problemId = request.body['problemId'];
  const userId = request.currentUser.id;

  const problem = await Problem.select.one(problemId);
  const cuil = await CourseUserIsLearning.select.oneByCourseIdAndUserId(problem.courseId, userId);

  const createdPuil = await ProblemUserIsLearning.insert.create({
    courseUserIsLearningId: cuil.id,
    problemId
  });
  response.status(200).json(createdPuil);
}));

router.delete('/:id', authenticateMiddleware, catchAsync(async (request, response) => {
  const puilId = request.params['id'];
  await ProblemUserIsLearning.ddelete.ddelete(puilId);
  response.status(200).json({});
}));

router.put('/:id/ignore', authenticateMiddleware, catchAsync(async (request, response) => {
  const ignoredPuil = await ProblemUserIsLearning.update.ignore(request.params['id']);
  response.status(200).json(ignoredPuil);
}));

export { router };
