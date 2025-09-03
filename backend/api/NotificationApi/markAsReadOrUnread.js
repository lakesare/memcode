import knex from '#~/db/knex.js';

const markAsReadOrUnread = async (request, response) => {
  const id = request.body['id'];
  const ifRead = request.body['ifRead'];

  await knex('notification')
    .where({ id })
    .update({ ifRead });

  response.success();
};

export default markAsReadOrUnread;
