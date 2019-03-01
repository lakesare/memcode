import knex from '~/db/knex';
import auth from '~/middlewares/auth';
import getRatingsAndAverageAndOwn from './services/getRatingsAndAverageAndOwn';

const rate = auth(async (request, response) => {
  const userId = request.currentUser.id;
  const courseId = request.body['courseId'];
  const rating = request.body['rating'];

  const existingRatingSql = await knex('courseRating').where({ userId, courseId });
  const existingRating = existingRatingSql[0];

  if (existingRating) {
    await knex('courseRating').where({ id: existingRating.id }).update({ rating });
  } else {
    await knex('courseRating').insert({ userId, courseId, rating });
  }

  const obj = await getRatingsAndAverageAndOwn(courseId, userId);

  response.success(obj);
});

export default rate;
