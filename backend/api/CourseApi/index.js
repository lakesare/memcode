import express from 'express';
import knex from '~/db/knex';
const router = express.Router();

import catchAsync from '~/services/catchAsync';
import authenticate from '~/middlewares/authenticate';

import CourseModel from '~/models/CourseModel';

// We converted this to getPublic.js, however I'm afraid to deploy it cause google rearch engine fetchers might not understand POST requests.
// This needs to be checked.
router.get('/public', catchAsync(async (request, response) => {
  const pageSize = request.query.pageSize;
  const pageNumber = request.query.pageNumber;

  const onePageOfCourses = await CourseModel.select.allPublic({
    sortBy: request.query.sortBy,
    limit: pageSize,
    offset: (pageNumber - 1) * pageSize,
    courseCategoryId: request.query.courseCategoryId,
    customWhere: `AND course.title ILIKE '%${request.query.searchString}%'`
  });

  const nOfAllCourses = onePageOfCourses[0] ? onePageOfCourses[0].nOfAllCourses : 0;

  response.status(200).json({
    onePageOfCourses,
    amountOfPages: Math.ceil(nOfAllCourses / pageSize)
  });
}));

router.get('/allCreated', authenticate, catchAsync(async (request, response) => {
  const courses = await CourseModel.select.allCreated(request.currentUser.id);
  response.status(200).json(courses);
}));

router.get('/search', catchAsync(async (request, response) => {
  const courses = await CourseModel.select.search(request.currentUser && request.currentUser.id, request.query.searchString);
  response.status(200).json(courses);
}));

router.post('/', authenticate, catchAsync(async (request, response) => {
  const currentUser = request.currentUser;
  const courseBody = request.body['course'];

  const course = (await knex('course').insert({
    title: courseBody.title,
    description: courseBody.description,
    if_public: courseBody.ifPublic,
    course_category_id: courseBody.courseCategoryId,
    user_id: currentUser.id
  })
    .returning('*'))[0];

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

// import getPublic from './getPublic';
// router.getPublic = getPublic;
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
import updateCoauthors from './updateCoauthors';
router.updateCoauthors = updateCoauthors;
import find from './find';
router.find = find;
export default router;
