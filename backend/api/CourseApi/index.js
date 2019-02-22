import express from 'express';
const router = express.Router();

import catchAsync from '~/services/catchAsync';
import { authenticateMiddleware, optionalAuthenticateMiddleware } from '~/middlewares/authenticate';

import CourseModel from '~/models/CourseModel';
import CourseUserIsLearningModel from '~/models/CourseUserIsLearningModel';
import CourseRatingByUserModel from '~/models/CourseRatingByUserModel';

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
router.get('/allLearned', authenticateMiddleware, catchAsync(async (request, response) => {
  const courseCategoryId = request.query.courseCategoryId;
  let courses = await CourseModel.select.allLearned(request.currentUser.id);

  if (courseCategoryId) {
    courses = courses.filter((course) => course.course.courseCategoryId.toString() === courseCategoryId.toString());
  }
  response.status(200).json(courses);
}));

router.get('/allCreated', authenticateMiddleware, catchAsync(async (request, response) => {
  const courses = await CourseModel.select.allCreated(request.currentUser.id);
  response.status(200).json(courses);
}));

router.get('/search', optionalAuthenticateMiddleware, catchAsync(async (request, response) => {
  const courses = await CourseModel.select.search(request.currentUser && request.currentUser.id, request.query.searchString);
  response.status(200).json(courses);
}));

// const getStats = async (request, response) => {
//   const courseStats = await CourseModel.select.getCourseStats(request.params.courseId);
//   response.status(200).json(courseStats);
// };

router.get('/stats', optionalAuthenticateMiddleware, catchAsync(async (request, response) => {
  const courseStats = await CourseModel.select.getCourseStats(request.params.courseId);
  response.status(200).json(courseStats);
}));

router.post('/', authenticateMiddleware, catchAsync(async (request, response) => {
  const course = await CourseModel.insert.create({ ...request.body['course'], userId: request.currentUser.id });

  // add to learned courses immediately
  await CourseUserIsLearningModel.insert.create({
    courseId: course.id,
    userId: request.currentUser.id,
    active: true
  });

  response.status(200).json(course);
}));

router.put('/:id', catchAsync(async (request, response) => {
  const updatedCourse = await CourseModel.update.update(request.params.id, request.body['course']);
  response.status(200).json(updatedCourse);
}));

router.delete('/:id', catchAsync(async (request, response) => {
  await CourseModel.ddelete.destroyCourseWithProblems(request.params.id);
  response.status(200).json({});
}));

router.put('/rate', authenticateMiddleware, catchAsync(async (request, response) => {
  const userId = request.currentUser.id;
  const rating = request.body['rating'];
  const courseId = request.body['courseId'];

  const existingRating = await CourseRatingByUserModel.select.oneOrNoneByUserAndCourse({
    userId,
    courseId
  });

  if (existingRating) {
    await CourseRatingByUserModel.update.rate({ rating, userId, courseId });
  } else {
    await CourseRatingByUserModel.create.rate({ rating, userId, courseId });
  }

  response.status(200).json({});
}));

export default router;
