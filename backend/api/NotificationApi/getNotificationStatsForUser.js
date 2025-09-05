import knex from '#~/db/knex.js';

// params = { userId }
const getNotificationStatsForUser = async (request, response) => {
  const userId = request.body.userId;

  const allNotifications = await knex('notification').where({ userId });
  const unreadNotifications = await knex('notification').where({ userId, ifRead: false });
  const user = await knex('user').where({ id: userId }).first();

  response.success({
    amountOfAllNotifications: allNotifications.length,
    amountOfUnreadNotifications: unreadNotifications.length,
    didSeeNotifications: user.didSeeNotifications
  });
};

export default getNotificationStatsForUser;
