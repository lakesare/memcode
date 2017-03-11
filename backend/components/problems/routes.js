import express from 'express';
const router = express.Router();

import { catchAsync } from '~/services/catchAsync';
import * as Problem from './model';

router.post('/', catchAsync(async (request, response) => {
  const createdProblem = await Problem.create(request.body['problem']);
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
