import knex from '#~/db/knex.js';
import { mustBeAdmin } from '#~/services/auth.js';

const announceNewFeature = async (request, response) => {
  await mustBeAdmin(request.currentUser);

  const type = request.body['type'];
  const content = request.body['content'];

  const users = await knex('user');

  await knex.transaction(async (trx) => {
    await Promise.all(users.map((user) =>
      trx()
        .insert({ type, content, ifRead: false, userId: user.id })
        .into('notification')
    ))
    
    // Mark all users as having unseen notifications
    await trx('user').update({ did_see_notifications: false });
  });

  response.success({ message: `${users.length} users are notified!` });
};


export default announceNewFeature;
