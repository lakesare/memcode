import knex from '#~/db/knex.js';
import auth from '#~/middlewares/auth.js';
import getRatingsAndAverageAndOwn from './services/getRatingsAndAverageAndOwn.js';
import NotificationModel from '#~/models/NotificationModel/index.js'

const rate = auth(async (request, response) => {
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

  await NotificationModel.insert.someone_rated_your_course({ raterId: userId, courseId, rating });

  const dto = await getRatingsAndAverageAndOwn(courseId, userId);

  response.success(dto);
});

export default rate;
