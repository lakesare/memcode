import knex from '#~/db/knex.js';
import isUserAdmin from '../../../services/isUserAdmin.js';

const deleteUser = async (request, response) => {
  if (!request.currentUser) {
    return response.status(401).json({ error: 'Authentication required for admin access' });
  }

  if (!isUserAdmin(request.currentUser)) {
    return response.status(403).json({ error: 'Admin access required' });
  }

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
