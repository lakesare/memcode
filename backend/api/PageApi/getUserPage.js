import knex from '~/db/knex';
import CourseModel from '~/models/CourseModel';

const getUserPage = async (request, response) => {
  const userId = request.body['userId'];
  const user = (await knex('user').where({ id: userId }))[0];

  // const coursesCreated = await knex('course').where({ userId });


  const coursesCreated = await CourseModel.select.allPublic({
    customWhere: `AND course.user_id=${userId}`
  });

  // const amountOfCoursesCreated = await knex('course').where({ userId }).count();

  // It's fine to expose emails of already-added users
  // const coauthors = await knex('user')
  //   .select('user.*')
  //   .join('coauthor', { 'coauthor.userId': 'user.id' })
  //   .where({ 'coauthor.courseId': courseId })
  //   .orderBy('coauthor.createdAt', 'asc');

  response.success({ user, coursesCreated });
};

export default getUserPage;
