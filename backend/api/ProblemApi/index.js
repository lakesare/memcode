import express from 'express';
const router = express.Router();

import catchAsync from '~/services/catchAsync';
import ProblemModel from '~/models/ProblemModel';

router.post('/', catchAsync(async (request, response) => {
  const createdProblem = await ProblemModel.insert.create(request.body['problem']);
  response.status(200).json(createdProblem);
}));

router.post('/createManyFromExcel', catchAsync(async (request, response) => {
  const courseId = request.body['courseId'];
  const problems = request.body['problems'];
  const arrayOfNulls = await ProblemModel.insert.createManyFromExcel(courseId, problems);
  response.status(200).json({ amountOfCreatedProblems: arrayOfNulls.length });
}));

router.put('/:id', catchAsync(async (request, response) => {
  const updatedProblem = await ProblemModel.update.update(request.body['problem'], request.params['id']);
  response.status(200).json(updatedProblem);
}));

import exportToExcel from './exportToExcel';
router.exportToExcel = exportToExcel;

import reorder from './reorder';
router.reorder = reorder;

import deleteMany from './deleteMany';
router.deleteMany = deleteMany;

import moveToCourseMany from './moveToCourseMany';
router.moveToCourseMany = moveToCourseMany;

export default router;
