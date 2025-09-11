import knex from '#~/db/knex.js';
import { mustBeAdmin } from '#~/services/auth.js';

const deleteUser = async (request, response) => {
  await mustBeAdmin(request.currentUser);

  const { userId } = request.body;

  if (!userId) {
    return response.validation(['User ID is required']);
  }

  const user = await knex('user').where('id', userId).first();
  
  if (!user) {
    return response.error('User not found');
  }

  const deletedCount = await knex('user').where('id', userId).del();

  if (deletedCount === 0) {
    return response.error('Failed to delete user');
  }

  response.success();
};

export default deleteUser;
