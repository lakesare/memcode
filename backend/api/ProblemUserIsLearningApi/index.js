import express from 'express';
const router = express.Router();

import catchAsync from '~/services/catchAsync';
import { authenticateMiddleware } from '~/middlewares/authenticate';

import ProblemModel from '~/models/ProblemModel';
import CourseUserIsLearningModel from '~/models/CourseUserIsLearningModel';
import ProblemUserIsLearningModel from '~/models/ProblemUserIsLearningModel';

router.post('/', authenticateMiddleware, catchAsync(async (request, response) => {
  const problemId = request.body['problemId'];
  const userId = request.currentUser.id;

  const problem = await ProblemModel.select.one(problemId);
  const cuil = await CourseUserIsLearningModel.select.oneByCourseIdAndUserId(problem.courseId, userId);

  const createdPuil = await ProblemUserIsLearningModel.insert.create({
    courseUserIsLearningId: cuil.id,
    problemId
  });
  response.status(200).json(createdPuil);
}));

router.delete('/:id', authenticateMiddleware, catchAsync(async (request, response) => {
  const puilId = request.params['id'];
  await ProblemUserIsLearningModel.delete.ddelete(puilId);
  response.status(200).json({});
}));

router.put('/:id/ignore', authenticateMiddleware, catchAsync(async (request, response) => {
  const ignoredPuil = await ProblemUserIsLearningModel.update.ignore(request.params['id']);
  response.status(200).json(ignoredPuil);
}));

export default router;
