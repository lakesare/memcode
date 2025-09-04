import knex from '#~/db/knex.js';

const deleteUser = async (request, response) => {
  const { userId } = request.body;

  if (!userId) {
    return response.validation(['User ID is required']);
  }

  try {
    // Start a transaction to ensure all deletions happen atomically
    await knex.transaction(async (trx) => {
      // First, check if user exists
      const user = await trx('user').where('id', userId).first();
      
      if (!user) {
        return response.error('User not found');
      }

      // Delete the user - this will cascade to delete:
      // - courses (and their problems via CASCADE)
      // - course_user_is_learning (and their problem_user_is_learning via CASCADE)  
      // - notifications
      // - course_rating
      // - coauthor relationships
      const deletedCount = await trx('user').where('id', userId).del();

      if (deletedCount === 0) {
        return response.error('Failed to delete user');
      }
    });

    response.success({ 
      message: 'User and all related data deleted successfully',
      deletedUserId: userId 
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    response.error(`Failed to delete user: ${error.message}`);
  }
};

export default deleteUser;
