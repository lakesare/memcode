import express from 'express';
const router = express.Router();

import { catchAsync } from '~/services/catchAsync';
import { authenticateMiddleware } from '~/middlewares/authenticate';

import * as CourseUserIsLearning from './model';

// => [{
//   ...usual course object,
//   courseUserIsLearningId: 10,
//   amountOfDueProblems: 3
// }], active, filtered by amount of due problems
router.get('/coursesWithDueProblems', authenticateMiddleware, catchAsync(async (request, response) => {
  const modifiedCourses = await CourseUserIsLearning.coursesWithDueProblems(request.currentUser.id);
  response.status(200).json(modifiedCourses);
}));

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
