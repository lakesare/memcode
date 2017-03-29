import express from 'express';
const router = express.Router();

import { catchAsync } from '~/services/catchAsync';
import * as Problem from './model';

router.get('/allByCourseId/:courseId', catchAsync(async (request, response) => {
  const problems = await Problem.select.allByCourseId(request.params['courseId']);
  response.status(200).json(problems);
}));

router.post('/', catchAsync(async (request, response) => {
  const createdProblem = await Problem.insert.create(request.body['problem']);
  response.status(200).json(createdProblem);
}));

router.put('/:id', catchAsync(async (request, response) => {
  const updatedProblem = await Problem.update(request.body['problem'], request.params['id']);
  response.status(200).json(updatedProblem);
}));

router.delete('/:id', catchAsync(async (request, response) => {
  await Problem.destroy(request.params['id']);
  response.status(200).json({});
}));

export { router };
