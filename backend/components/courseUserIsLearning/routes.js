import express from 'express';
const router = express.Router();

import { catchAsync } from '~/services/catchAsync';
import * as CourseUserIsLearning from './model';

router.get('/:id/dueProblems', catchAsync(async (request, response) => {
  const dueProblems = await CourseUserIsLearning.getDueProblems(request.params['id']);
  response.status(200).json(dueProblems);
}));

router.post('/', catchAsync(async (request, response) => {
  await CourseUserIsLearning.create(request.body['courseUserIsLearning']);
  response.status(200).json({});
}));

router.post('/:id/updateProblemScore', catchAsync(async (request, response) => {
  await CourseUserIsLearning.updateProblemScore(request.params['id'], request.body['problemId'], request.body['performanceRating']);
  response.status(200).json({});
}));

export { router };
