import express from 'express';
import knex from '~/db/knex';
const router = express.Router();

import catchAsync from '~/services/catchAsync';
import authenticate from '~/middlewares/authenticate';

import CourseModel from '~/models/CourseModel';

router.get('/public', catchAsync(async (request, response) => {
  const pageSize = request.query.pageSize;
  const pageNumber = request.query.pageNumber;
  const onePageOfCourses = await CourseModel.select.allPublic({
    sortBy: request.query.sortBy,
    limit: pageSize,
    offset: (pageNumber - 1) * pageSize,
    courseCategoryId: request.query.courseCategoryId
  });
  const amountOfAllCourses = await CourseModel.select.countAllPublic({
    courseCategoryId: request.query.courseCategoryId
  });

  response.status(200).json({
    onePageOfCourses,
    amountOfPages: Math.ceil(amountOfAllCourses / pageSize)
  });
}));

// => [{
//   course: {},
//   courseUserIsLearning: {},
//   amountOfProblemsToReview: 3
//   amountOfProblemsToLearn: 1
// }], active, filtered by amount of due problems
router.get('/allLearned', authenticate, catchAsync(async (request, response) => {
  const courseCategoryId = request.query.courseCategoryId;
  let courses = await CourseModel.select.allLearned(request.currentUser.id);

  if (courseCategoryId) {
    courses = courses.filter((course) => course.course.courseCategoryId.toString() === courseCategoryId.toString());
  }
  response.status(200).json(courses);
}));

router.get('/allCreated', authenticate, catchAsync(async (request, response) => {
  const courses = await CourseModel.select.allCreated(request.currentUser.id);
  response.status(200).json(courses);
}));

router.get('/search', catchAsync(async (request, response) => {
  const courses = await CourseModel.select.search(request.currentUser && request.currentUser.id, request.query.searchString);
  response.status(200).json(courses);
}));

// const getStats = async (request, response) => {
//   const courseStats = await CourseModel.select.getCourseStats(request.params.courseId);
//   response.status(200).json(courseStats);
// };

router.get('/stats', catchAsync(async (request, response) => {
  const courseStats = await CourseModel.select.getCourseStats(request.params.courseId);
  response.status(200).json(courseStats);
}));

router.post('/', authenticate, catchAsync(async (request, response) => {
  const currentUser = request.currentUser;
  const courseBody = request.body['course'];

  const course = await CourseModel.insert.create({ ...courseBody, userId: currentUser.id });

  // Add to learned courses immediately
  await knex('courseUserIsLearning').insert({ courseId: course.id, userId: currentUser.id, active: true });

  response.status(200).json(course);
}));

router.put('/:id', catchAsync(async (request, response) => {
  const updatedCourse = await CourseModel.update.update(request.params.id, request.body['course']);
  response.status(200).json(updatedCourse);
}));

router.delete('/:id', catchAsync(async (request, response) => {
  await CourseModel.delete.destroyCourseWithProblems(request.params.id);
  response.status(200).json({});
}));

import rate from './rate';
router.rate = rate;
import getRatings from './getRatings';
router.getRatings = getRatings;
import getMyEverything from './getMyEverything';
router.getMyEverything = getMyEverything;
import getBest4 from './getBest4';
router.getBest4 = getBest4;
import duplicate from './duplicate';
router.duplicate = duplicate;
export default router;
