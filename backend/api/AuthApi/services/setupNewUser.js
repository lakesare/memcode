import knex from '#~/db/knex.js';
import NotificationModel from '#~/models/NotificationModel.js';

/**
 * Sets up a newly created user with welcome notification and welcome course
 * @param {Object} user - The newly created user object with user.id
 */
const setupNewUser = async (user) => {
  // Create welcome notification
  await NotificationModel.create({ type: 'welcome_to_memcode', content: {}, userId: user.id });
  
  // Only assign welcome course in production
  if (process.env.NODE_ENV === 'production') {
    const welcomeCourseId = 6868;
    await knex('courseUserIsLearning').insert({ 
      courseId: welcomeCourseId, 
      userId: user.id, 
      active: true 
    });
  }
};

export default setupNewUser;
