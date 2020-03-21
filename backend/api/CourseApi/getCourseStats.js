import knex from '~/db/knex';
import db from '~/db/init';

const getCourseStats = async (request, response) => {
  const courseId = request.body['courseId'];

  const course = (await knex('course').where({ id: courseId }))[0];
  const author = (await knex('user').where({ id: author.user_id }))[0];
  const course_category = (await knex('course_category').where({ id: course.course_category_id }))[0];
  const amount_of_problems = (await knex('problem').count('id as amount').where({ course_id: course.id }))[0].amount;
  const learners = await db.any(
    `
    SELECT *
    FROM "user"
    INNER JOIN course_user_is_learning
      ON course_user_is_learning.user_id = user.id
    WHERE
      course_user_is_learning.course_id = \${courseId}
      AND
      course_user_is_learning.active = true
    `,
    { courseId }
  );

  response.success({
    course, author, course_category, amount_of_problems,
    learners
  });
};

export default getCourseStats;
