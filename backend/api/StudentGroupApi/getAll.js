import knex from '~/db/knex';
import auth from '~/middlewares/auth';

const getAll = auth(async (request, response) => {
  const userId = request.currentUser.id;

  const studentGroups = await knex('studentGroup')
    .select('*')
    .where({ userId });

  const students = await knex('studentInGroup')
    .select('*')
    .join('user', { 'studentInGroup.userId': 'user.id' })
    .whereIn('studentGroupId', studentGroups.map((group) => group.id));

  response.success({
    studentGroups,
    students
  });
});

export default getAll;
