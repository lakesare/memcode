import express from 'express';
const router = express.Router();

import { catchAsync } from '~/services/catchAsync';
import * as Course from './model';

import { authenticateMiddleware } from '~/middlewares/authenticate';


router.get('/:id', catchAsync(async (request, response) => {
  const course = await Course.getCourseWithProblems(request.params.id);
  response.json(course);
}));

router.get('/', catchAsync(async (request, response) => {
  const courses = await Course.getCourses();
  response.json(courses);
}));

router.post('/', authenticateMiddleware, catchAsync(async (request, response) => {
  const course = {
    ...request.body['course'],
    userOauthId: request.currentUser.oauthId,
    userOauthProvider: request.currentUser.oauthProvider
  };

  const courseIdMap = await Course.createCourseWithProblems(course, request.body['problems']);
  response.json(courseIdMap);
}));

router.put('/:id', catchAsync(async (request, response) => {
  await Course.update(request.body['course']);
  response.status(200);
}));

router.delete('/:id', catchAsync(async (request, response) => {
  await Course.deleteCourseWithProblems(request.params.id);
  response.status(200);
}));

export { router };
