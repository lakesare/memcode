import knex from '#~/db/knex.js';
import AdminService from '../../../shared/services/AdminService.js';

const getUserDeletionStats = async (request, response) => {
  if (!request.currentUser) {
    return response.status(401).json({ error: 'Authentication required for admin access' });
  }

  if (!AdminService.isUserAdmin(request.currentUser)) {
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

  const courses = await knex('course')
    .where('user_id', userId)
    .select('id', 'title', 'description', 'if_public', 'created_at');

  const courseIds = courses.map(c => c.id);
  const stats = {};

  if (courseIds.length > 0) {
    const problemCount = await knex('problem')
      .whereIn('course_id', courseIds)
      .count('* as count')
      .first();
    stats.problemsCount = parseInt(problemCount.count);

    const learningProgressCount = await knex('course_user_is_learning')
      .whereIn('course_id', courseIds)
      .count('* as count')
      .first();
    stats.learningProgressCount = parseInt(learningProgressCount.count);

    const problemLearningProgressCount = await knex('problem_user_is_learning')
      .join('course_user_is_learning', 'problem_user_is_learning.course_user_is_learning_id', 'course_user_is_learning.id')
      .whereIn('course_user_is_learning.course_id', courseIds)
      .count('* as count')
      .first();
    stats.problemLearningProgressCount = parseInt(problemLearningProgressCount.count);

    const courseRatingsCount = await knex('course_rating')
      .whereIn('course_id', courseIds)
      .count('* as count')
      .first();
    stats.courseRatingsCount = parseInt(courseRatingsCount.count);
  } else {
    stats.problemsCount = 0;
    stats.learningProgressCount = 0;
    stats.problemLearningProgressCount = 0;
    stats.courseRatingsCount = 0;
  }

  const notificationsCount = await knex('notification')
    .where('user_id', userId)
    .count('* as count')
    .first();
  stats.notificationsCount = parseInt(notificationsCount.count);

  const coauthorCount = await knex('coauthor')
    .where('user_id', userId)
    .count('* as count')
    .first();
  stats.coauthorCount = parseInt(coauthorCount.count);

  response.success({
    user,
    courses,
    stats
  });
};

export default getUserDeletionStats;
