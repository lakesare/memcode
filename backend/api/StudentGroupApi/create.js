import knex from '~/db/knex';
import auth from '~/middlewares/auth';

const create = auth(async (request, response) => {
  const userId = request.currentUser.id;
  const title = request.body['title'];

  const createdGroup = (await knex('studentGroup').insert({ title, userId }).returning('*'))[0];

  response.success(createdGroup);
});

export default create;
