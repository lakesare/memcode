import knex from '#~/db/knex.js';
import auth from '#~/middlewares/auth.js';
import getRatingsAndAverageAndOwn from './services/getRatingsAndAverageAndOwn.js';

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

  // Create someone_rated_your_course notification
  const rater = (await knex('user').where({ id: userId }))[0];
  const course = (await knex('course').where({ id: courseId }))[0];
  const courseAuthorId = course.userId;

  // Create the notification
  await knex('notification').insert({ 
    type: 'someone_rated_your_course',
    content: {
      rating,
      raterId: rater.id,
      courseId: course.id,
      raterUsername: rater.username,
      raterAvatarUrl: rater.avatarUrl,
      courseTitle: course.title
    },
    userId: courseAuthorId,
    ifRead: false
  });
  
  // Mark that the user has unseen notifications
  await knex('user')
    .where({ id: courseAuthorId })
    .update({ did_see_notifications: false });

  const dto = await getRatingsAndAverageAndOwn(courseId, userId);

  response.success(dto);
});

export default rate;
