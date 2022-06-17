import knex from '~/db/knex';

const addEveryoneToWelcomeCourse = async (request, response) => {
  const users = await knex('user').select('id');

  users.forEach(async (user) => {
    const welcomeCourseId = 6868;
    await knex('courseUserIsLearning').insert({ courseId: welcomeCourseId, userId: user.id, active: true });
  });

  response.success(users);
};

export default addEveryoneToWelcomeCourse;
