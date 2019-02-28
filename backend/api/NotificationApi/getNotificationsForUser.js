import knex from '~/db/knex';

const getNotificationsForUser = async (request, response) => {
  const userId = request.body['userId'];
  const limit = request.body['limit'];
  const offset = request.body['offset'];

  const notifications = await knex('notification')
    .select(knex.raw("*, (created_at - timezone('UTC', now())) AS created_at_diff_from_now"))
    .where({ userId })
    .offset(offset)
    .limit(limit)
    .orderBy('createdAt', 'desc');

  response.success(notifications);
};

export default getNotificationsForUser;
