import express from 'express';
const router = express.Router();

import { catchAsync } from '~/services/catchAsync';
import { authenticateMiddleware, optionalAuthenticateMiddleware } from '~/middlewares/authenticate';

import * as Course from './model';
import * as CourseUserIsLearning from '~/components/coursesUserIsLearning/model';

// => [{
//   course: {},
//   courseUserIsLearning: {},
//   amountOfProblemsToReview: 3
//   amountOfProblemsToLearn: 1
// }], active, filtered by amount of due problems
router.get('/allLearned', authenticateMiddleware, catchAsync(async (request, response) => {
  const courses = await Course.select.allLearned(request.currentUser.id);
  response.status(200).json(courses);
}));

router.get('/allCreated', authenticateMiddleware, catchAsync(async (request, response) => {
  const courses = await Course.select.allCreated(request.currentUser.id);
  response.status(200).json(courses);
}));

router.get('/search', optionalAuthenticateMiddleware, catchAsync(async (request, response) => {
  const courses = await Course.select.search(request.currentUser && request.currentUser.id, request.query.searchString);
  response.status(200).json(courses);
}));

router.post('/', authenticateMiddleware, catchAsync(async (request, response) => {
  const course = await Course.insert.create(request.body['course'], request.currentUser.id);

  // add to learned courses immediately
  await CourseUserIsLearning.insert.create(course.id, request.currentUser.id);

  response.status(200).json(course);
}));

router.put('/:id', catchAsync(async (request, response) => {
  const updatedCourse = await Course.update.update(request.params.id, request.body['course']);
  response.status(200).json(updatedCourse);
}));

router.delete('/:id', catchAsync(async (request, response) => {
  await Course.ddelete.destroyCourseWithProblems(request.params.id);
  response.status(200).json({});
}));

export { router };
