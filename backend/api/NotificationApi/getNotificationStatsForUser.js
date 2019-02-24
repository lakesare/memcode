import knex from '~/db/knex';

// params = { userId }
const getNotificationStatsForUser = async (request, response) => {
  const userId = request.query.userId;

  const allNotifications = await knex('notification').where({ userId });
  const unreadNotifications = await knex('notification').where({ userId, ifRead: false });

  response.success({
    amountOfAllNotifications: allNotifications.length,
    amountOfUnreadNotifications: unreadNotifications.length
  });
};

export default getNotificationStatsForUser;
