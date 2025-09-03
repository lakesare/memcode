import knex from '#~/db/knex.js';
import auth from '#~/middlewares/auth.js';

const update = auth(async (request, response) => {
  const id = request.body['id'];
  const problem = request.body['problem'];

  await knex('problem').where({ id }).update(problem);

  response.success();
});

export default update;
