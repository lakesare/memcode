import knex from '#~/db/knex.js';

// params = { userId }
const markNotificationsAsSeen = async (request, response) => {
  const userId = request.body.userId;

  await knex('user')
    .where({ id: userId })
    .update({ did_see_notifications: true });

  response.success({});
};

export default markNotificationsAsSeen;
