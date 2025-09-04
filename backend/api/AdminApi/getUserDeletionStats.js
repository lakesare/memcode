import knex from '#~/db/knex.js';

const getUserDeletionStats = async (request, response) => {
  const { userId } = request.body;

  if (!userId) {
    return response.validation(['User ID is required']);
  }

  try {
    // Check if user exists
    const user = await knex('user').where('id', userId).first();
    
    if (!user) {
      return response.error('User not found');
    }

    // Get courses created by this user
    const courses = await knex('course')
      .where('user_id', userId)
      .select('id', 'title', 'description', 'if_public', 'created_at');

    const courseIds = courses.map(c => c.id);

    // Get statistics
    const stats = {};

    // Count problems in user's courses
    if (courseIds.length > 0) {
      const problemCount = await knex('problem')
        .whereIn('course_id', courseIds)
        .count('* as count')
        .first();
      stats.problemsCount = parseInt(problemCount.count);

      // Count learning progress on user's courses (course_user_is_learning)
      const learningProgressCount = await knex('course_user_is_learning')
        .whereIn('course_id', courseIds)
        .count('* as count')
        .first();
      stats.learningProgressCount = parseInt(learningProgressCount.count);

      // Count problem learning progress (problem_user_is_learning via course_user_is_learning)
      const problemLearningProgressCount = await knex('problem_user_is_learning')
        .join('course_user_is_learning', 'problem_user_is_learning.course_user_is_learning_id', 'course_user_is_learning.id')
        .whereIn('course_user_is_learning.course_id', courseIds)
        .count('* as count')
        .first();
      stats.problemLearningProgressCount = parseInt(problemLearningProgressCount.count);

      // Count course ratings
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

    // Count notifications for this user
    const notificationsCount = await knex('notification')
      .where('user_id', userId)
      .count('* as count')
      .first();
    stats.notificationsCount = parseInt(notificationsCount.count);

    // Count coauthor relationships where this user is a coauthor
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
  } catch (error) {
    console.error('Error getting user deletion stats:', error);
    response.error(`Failed to get user stats: ${error.message}`);
  }
};

export default getUserDeletionStats;
