import express from 'express';
const router = express.Router();

import catchAsync from '~/services/catchAsync';
import authenticate from '~/middlewares/authenticate';

import CourseModel from '~/models/CourseModel';
import CourseUserIsLearningModel from '~/models/CourseUserIsLearningModel';
import CourseRatingModel from '~/models/CourseRatingModel';

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
  await CourseModel.delete.destroyCourseWithProblems(request.params.id);
  response.status(200).json({});
}));

const _getRatingsAndAverageAndOwn = async (courseId, currentUserId) => {
  const ratings = await CourseRatingModel.select.anyByCourse({
    courseId
  });

  const amountOfRatings = ratings.length;

  let averageRating;
  if (amountOfRatings > 0) {
    const sumOfAllRatings = ratings.reduce((acc, rating) => acc + rating.rating, 0);
    const aveRating = sumOfAllRatings / amountOfRatings;
    averageRating = parseFloat(aveRating.toFixed(2));
  } else {
    averageRating = null;
  }

  let ownRating;
  if (currentUserId) {
    const rating = await CourseRatingModel.select.oneOrNoneByUserAndCourse({
      userId: currentUserId,
      courseId
    });
    ownRating = rating ? rating.rating : null;
  } else {
    ownRating = null;
  }

  return {
    ratings,
    averageRating,
    ownRating
  };
};

router.get('/:id/ratings', catchAsync(async (request, response) => {
  const courseId = request.params.id;
  const currentUserId = request.currentUser ? request.currentUser.id : null;

  const obj = await _getRatingsAndAverageAndOwn(courseId, currentUserId);

  response.status(200).json(obj);
}));

// const rate = (dispatch, courseId, rating) =>
//   commonFetch(dispatch,
//     'PUT', `/api/courses/${courseId}/rate`,
//     { rating }
//   );

// @authenticate
// const rate = (request, response) => {}
router.put('/:id/rate', authenticate, catchAsync(async (request, response) => {
  const userId = request.currentUser.id;
  const courseId = request.params.id;
  const rating = request.body['rating'];

  const existingRating = await CourseRatingModel.select.oneOrNoneByUserAndCourse({
    userId,
    courseId
  });

  // const existingRating = CourseRatingByUser.where({ userId, courseId })[0];
  // knex('CourseRatingByUser').where({ userId, courseId })[0]

  if (existingRating) {
    await CourseRatingModel.update.rate({ id: existingRating.id, rating });
  } else {
    await CourseRatingModel.insert.rate({ userId, courseId, rating });
  }

  const obj = await _getRatingsAndAverageAndOwn(courseId, userId);

  response.status(200).json(obj);
}));

export default router;
