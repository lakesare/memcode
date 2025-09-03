import knex from '#~/db/knex.js';
import auth from '#~/middlewares/auth.js';

const reorder = auth(async (request, response) => {
  const idOrderMap = request.body;

  const promises = idOrderMap.map(({ id, position }) =>
    knex('problem').where({ id }).update({ position })
  );

  await Promise.all(promises);

  response.success();
});

export default reorder;
