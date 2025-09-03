import knex from '#~/db/knex.js';

const markAllNotificationsAsRead = async (request, response) => {
  await knex('notification')
    .where({ userId: request.body['userId'], ifRead: false })
    .update({ ifRead: true });

  response.success();
};

export default markAllNotificationsAsRead;
