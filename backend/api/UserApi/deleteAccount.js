import knex from '#~/db/knex.js';
import { mustBeAuthenticated } from '#~/services/auth.js';

const deleteAccount = async (request, response) => {
  await mustBeAuthenticated(request.currentUser);

  const userId = request.currentUser.id;

  await knex.transaction(async (trx) => {
    // coauthor.user_id has no ON DELETE CASCADE, so these rows must be removed before the user
    await trx('coauthor').where('user_id', userId).del();
    // deleting the user cascades to their courses, learning records, ratings, notifications and stats
    await trx('user').where('id', userId).del();
  });

  response.success();
};

export default deleteAccount;
