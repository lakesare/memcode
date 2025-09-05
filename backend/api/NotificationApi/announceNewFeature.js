import knex from '#~/db/knex.js';
import AdminService from '../../../shared/services/AdminService.js';

const announceNewFeature = async (request, response) => {
  if (!request.currentUser) {
    return response.status(401).json({ error: 'Authentication required for admin access' });
  }

  if (!AdminService.isUserAdmin(request.currentUser)) {
    return response.status(403).json({ error: 'Admin access required' });
  }

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
