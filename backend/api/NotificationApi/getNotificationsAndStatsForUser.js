import knex from '#~/db/knex.js';

const getNotificationsAndStatsForUser = async (request, response) => {
  const userId = request.body['userId'];
  const limit = request.body['limit'] || 15;
  const offset = request.body['offset'] || 0;

  // Get notifications with pagination
  const notifications = await knex('notification')
    .select(knex.raw("*, (created_at - now()) AS created_at_diff_from_now"))
    .where({ userId })
    .offset(offset)
    .limit(limit)
    .orderBy('createdAt', 'desc');

  // Get stats in parallel
  const [allNotifications, unreadNotifications, user] = await Promise.all([
    knex('notification').where({ userId }),
    knex('notification').where({ userId, ifRead: false }),
    knex('user').where({ id: userId }).first()
  ]);

  const stats = {
    amountOfAllNotifications: allNotifications.length,
    amountOfUnreadNotifications: unreadNotifications.length,
    didSeeNotifications: user.didSeeNotifications
  };

  response.success({
    notifications,
    stats
  });
};

export default getNotificationsAndStatsForUser;
