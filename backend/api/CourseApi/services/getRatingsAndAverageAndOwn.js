import knex from '~/db/knex';

const getRatingsAndAverageAndOwn = async (courseId, currentUserId) => {
  const ratings = await knex('courseRating').where({ courseId });

  const averageRatingSql = await knex('courseRating')
    .select(knex.raw('ROUND(AVG(rating), 1) AS average_rating'))
    .where({ courseId });
  const averageRating = averageRatingSql[0].averageRating;

  let ownRating;
  if (currentUserId) {
    const rating = await knex('courseRating').where({ userId: currentUserId, courseId });
    ownRating = rating[0] ? rating[0].rating : null;
  } else {
    ownRating = null;
  }

  return {
    ratings,
    averageRating,
    ownRating
  };
};

export default getRatingsAndAverageAndOwn;
