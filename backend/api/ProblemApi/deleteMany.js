import knex from '#~/db/knex.js';

const deleteMany = async (request, response) => {
  const ids = request.body['ids'];

  await knex('problem')
    .whereIn('id', ids)
    .del();

  response.success();
};

export default deleteMany;
