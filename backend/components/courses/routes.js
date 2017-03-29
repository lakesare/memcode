import express from 'express';
const router = express.Router();

import { catchAsync } from '~/services/catchAsync';
import { authenticateMiddleware } from '~/middlewares/authenticate';

import * as Course from './model';

router.get('/', catchAsync(async (request, response) => {
  const courses = await Course.select.all();
  response.status(200).json(courses);
}));

// => [{
//   course: {},
//   courseUserIsLearning: {},
//   amountOfProblemsToReview: 3
//   amountOfProblemsToLearn: 1
// }], active, filtered by amount of due problems
router.get('/allLearned', authenticateMiddleware, catchAsync(async (request, response) => {
  const res = await Course.select.allLearned(request.currentUser.id);
  response.status(200).json(res);
}));

router.get('/allCreated', authenticateMiddleware, catchAsync(async (request, response) => {
  const res = await Course.select.allCreated(request.currentUser.id);
  response.status(200).json(res);
}));

// move to /pages
router.get('/:id', authenticateMiddleware, catchAsync(async (request, response) => {
  const course = await Course.select.oneForActions(request.params.id, request.currentUser.id);
  response.status(200).json(course);
}));

router.post('/', authenticateMiddleware, catchAsync(async (request, response) => {
  const courseId = await Course.insert.create(request.body['course'], request.currentUser.id);

  response.status(200).json(courseId);
}));

router.put('/:id', catchAsync(async (request, response) => {
  await Course.update.update(request.body['course']);
  response.status(200).json({});
}));

router.delete('/:id', catchAsync(async (request, response) => {
  await Course.ddelete.destroyCourseWithProblems(request.params.id);
  response.status(200).json({});
}));

export { router };
