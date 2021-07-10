import knex from '~/db/knex';
import auth from '~/middlewares/auth';

const update = auth(async (request, response) => {
  const id = request.body['id'];
  const problem = request.body['problem'];

  await knex('problem').where({ id }).update(problem);

  response.success();
});

export default update;
