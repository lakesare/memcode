import express from 'express';
const router = express.Router();

import catchAsync from '~/services/catchAsync';
import { authenticateMiddleware, optionalAuthenticateMiddleware } from '~/middlewares/authenticate';

import CourseUserIsLearningModel from '~/models/CourseUserIsLearningModel';
import ProblemUserIsLearningModel from '~/models/ProblemUserIsLearningModel';
import CourseModel from '~/models/CourseModel';
import ProblemModel from '~/models/ProblemModel';

// ___per-page routes (/api/pages/page-url)
// {
//   courseUserIsLearning: {...},
//   problems: [
//     {coursesUserIsLearning
//       problem, problemUserIsLearning
//     },
//     {
//       problem
//     }
//   ]
// }
router.get('/courses/:id/learn', authenticateMiddleware, catchAsync(async (request, response) => {
  const courseId = request.params['id'];

  // find cuil
  const courseUserIsLearning = await CourseUserIsLearningModel.select.oneByCourseIdAndUserId(courseId, request.currentUser.id);

  // find problems
  const problems = await ProblemModel.select.allByCourseId(courseId);
  const problemUserIsLearnings = await ProblemUserIsLearningModel.select.allByCuilId(courseUserIsLearning.id);

  response.status(200).json({ courseUserIsLearning, problems, problemUserIsLearnings });
}));

router.get('/courses/:id/review', authenticateMiddleware, catchAsync(async (request, response) => {
  const courseId = request.params['id'];

  const courseUserIsLearning = await CourseUserIsLearningModel.select.oneByCourseIdAndUserId(courseId, request.currentUser.id);
  const problems = await CourseUserIsLearningModel.select.problemsToReview(courseUserIsLearning.id);
  response.status(200).json({ courseUserIsLearning, problems });
}));

router.get('/courses/:id/review/simulated', catchAsync(async (request, response) => {
  const courseId = request.params['id'];
  const problems = await ProblemModel.select.allByCourseId(courseId);
  response.status(200).json({ courseUserIsLearning: null, problems });
}));

router.get('/courses/:id/edit', authenticateMiddleware, catchAsync(async (request, response) => {
  const courseId = request.params['id'];

  const course = await CourseModel.select.oneById(courseId);
  const problems = await ProblemModel.select.allByCourseId(courseId);

  response.status(200).json({ course, problems });
}));

router.get('/courses/:id', catchAsync(async (request, response) => {
  const courseId = request.params['id'];

  const problems = await ProblemModel.select.allByCourseId(courseId);

  response.status(200).json(problems);
}));

// per-component routes (/api/pages/componentName/...)
router.get('/courseActions/:courseId', optionalAuthenticateMiddleware, catchAsync(async (request, response) => {
  const course = await CourseModel.select.oneForActions(request.params.courseId, request.currentUser ? request.currentUser.id : null);
  if (!course) throw new Error("Sorry, course with this id has not yet been created.");
  const courseStats = await CourseModel.select.getCourseStats(request.params.courseId);

  response.status(200).json({ ...course, stats: courseStats });
}));

// global state (?)
router.get('/idsOfProblemsToLearnAndReviewPerCourse', authenticateMiddleware, catchAsync(async (request, response) => {
  const idsOfProblemsToLearnAndReviewPerCourse = await CourseUserIsLearningModel.select.idsOfProblemsToLearnAndReviewPerCourse(request.currentUser.id);
  response.status(200).json(idsOfProblemsToLearnAndReviewPerCourse);
}));

export default router;
