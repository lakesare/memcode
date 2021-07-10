import knex from '~/db/knex';
import auth from '~/middlewares/auth';

const create = auth(async (request, response) => {
  const problem = request.body['problem'];

  const createdProblem = (await knex('problem').insert(problem).returning('*'))[0];

  response.success(createdProblem);
});

export default create;
