import knex from '#~/db/knex.js';
import { mustBeAuthenticated } from '#~/services/auth.js';
import getRatingsAndAverageAndOwn from './services/getRatingsAndAverageAndOwn.js';
import NotificationModel from '#~/models/NotificationModel.js';

const rate = async (request, response) => {
  await mustBeAuthenticated(request.currentUser);
  const userId = request.currentUser.id;
  const courseId = request.body['courseId'];
  const rating = request.body['rating'];

  const existingRatingSql = await knex('courseRating').where({ userId, courseId });
  const existingRating = existingRatingSql[0];

  if (existingRating) {
    await knex('courseRating').where({ userId, courseId }).update({ rating });
  } else {
    await knex('courseRating').insert({ userId, courseId, rating });
  }

  // Create someone_rated_your_course notification
  const rater = (await knex('user').where({ id: userId }))[0];
  const course = (await knex('course').where({ id: courseId }))[0];
  const courseAuthorId = course.userId;

  await NotificationModel.create({
    type: 'someone_rated_your_course',
    content: { rating, raterId: rater.id, courseId: course.id, raterUsername: rater.username, raterAvatarUrl: rater.avatarUrl, courseTitle: course.title },
    userId: courseAuthorId
  });

  const dto = await getRatingsAndAverageAndOwn(courseId, userId);

  response.success(dto);
};

export default rate;
