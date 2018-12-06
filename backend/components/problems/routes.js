import express from 'express';
const router = express.Router();

import { catchAsync } from '~/services/catchAsync';
import * as Problem from './model';

router.get('/', catchAsync(async (request, response) => {
  const courseId = request.query.courseId;
  const problemsByCourseId = await Problem.select.allByCourseId(courseId);

  response.status(200).json(problemsByCourseId);
}));

router.post('/', catchAsync(async (request, response) => {
  const createdProblem = await Problem.insert.create(request.body['problem']);
  response.status(200).json(createdProblem);
}));

router.post('/createManyFromExcel', catchAsync(async (request, response) => {
  const courseId = request.body['courseId'];
  const problems = request.body['problems'];
  const arrayOfNulls = await Problem.insert.createManyFromExcel(courseId, problems);
  response.status(200).json({ amountOfCreatedProblems: arrayOfNulls.length });
}));

router.put('/:id', catchAsync(async (request, response) => {
  const updatedProblem = await Problem.update(request.body['problem'], request.params['id']);
  response.status(200).json(updatedProblem);
}));

router.delete('/deleteMany', catchAsync(async (request, response) => {
  await Problem.ddelete.deleteMany(request.body['problemIds']);
  response.status(200).json({});
}));

router.post('/moveToCourseMany', catchAsync(async (request, response) => {
  await Problem.insert.moveToCourseMany(
    request.body['problemIds'],
    request.body['courseId']
  );
  response.status(200).json({});
}));

export { router };
