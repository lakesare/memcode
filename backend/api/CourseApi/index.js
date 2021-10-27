import express from 'express';
import knex from '~/db/knex';
const router = express.Router();

import catchAsync from '~/services/catchAsync';
import authenticate from '~/middlewares/authenticate';

import CourseModel from '~/models/CourseModel';

router.get('/public', catchAsync(async (request, response) => {
  const pageSize = request.query.pageSize;
  const pageNumber = request.query.pageNumber;

  // Conversion effort -  Raw SQL to Knex like syntax
  // Can be used later when support for some functions like count, camelize column names are available from knex

  // let query = knex().select(knex.raw('row_to_json(course.*) AS course, row_to_json("user".*) AS author, row_to_json(course_category.*) AS course_category, COUNT(distinct course_user_is_learning.user_id) AS amount_of_users_learning_this_course, ROUND(AVG(course_rating.rating),1) AS average_course_rating, COUNT(distinct problem.id) AS amount_of_problems, COUNT(distinct course_rating.id) AS amount_of_course_ratings'))
  // .from('course')
  // .innerJoin('problem', 'problem.course_id', '=', 'course.id')
  // .innerJoin('user', 'course.user_id', '=', 'user.id')
  // .innerJoin('course_category', 'course.course_category_id', '=', 'course_category.id')
  // .leftOuterJoin('course_rating', 'course_rating.course_id', 'course.id')
  // .leftOuterJoin(knex.raw('course_user_is_learning ON (course_user_is_learning.active = true AND course.id = course_user_is_learning.course_id)'))
  // .where('course.if_public', 'true')
  // .andWhere(2, "<=", subquery)
  // .groupByRaw('course.id, "user".id, course_category.id')
  // .orderByRaw(sortByQuery) // This function to be copied from model
  // pageSize ? query.limit(pageSize) : '';
  // pageNumber && pageSize ? query.offset((pageNumber - 1) * pageSize) : '';

  // const OnePageOfCourses = await query;

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
