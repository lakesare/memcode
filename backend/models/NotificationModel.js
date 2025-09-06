import knex from '#~/db/knex.js';

const create = async ({ type, content, userId }) => {
  // Create the notification
  const result = await knex('notification').insert({ type, content, userId, ifRead: false });
  // Mark that the user has unseen notifications
  await knex('user').where({ id: userId }).update({ did_see_notifications: false });
  return result;
};

export default {
  create
};
