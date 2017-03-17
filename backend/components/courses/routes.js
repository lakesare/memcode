import express from 'express';
const router = express.Router();

import { catchAsync } from '~/services/catchAsync';
import { authenticateMiddleware } from '~/middlewares/authenticate';

import * as Course from './model';

// => {
//   course,
//   problems,
//   courseUserIsLearning: null // OR { id: 1, active: false }
// }
router.get('/:id', authenticateMiddleware, catchAsync(async (request, response) => {
  const course = await Course.getCourseWithProblems(request.currentUser.id, request.params.id);
  response.status(200).json(course);
}));

router.get('/', catchAsync(async (request, response) => {
  const courses = await Course.getCourses();
  response.status(200).json(courses);
}));

router.post('/', authenticateMiddleware, catchAsync(async (request, response) => {
  const course = {
    ...request.body['course'],
    userId: request.currentUser.id,
  };
  const courseId = await Course.create(course);

  response.status(200).json(courseId);
}));

router.put('/:id', catchAsync(async (request, response) => {
  await Course.update(request.body['course']);
  response.status(200).json({});
}));

router.delete('/:id', catchAsync(async (request, response) => {
  await Course.destroyCourseWithProblems(request.params.id);
  response.status(200).json({});
}));

export { router };
