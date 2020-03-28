import knex from '~/db/knex';

const rate = async (request, response) => {
  const searchString = request.body['searchString'];

  // const existingRatingSql = await knex('courseRating').where({ userId, courseId });

  const courses = await knex('course').where('title', 'ilike', '%' + searchString + '%');

  response.success(courses);
};

export default rate;
