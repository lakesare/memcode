import knex from '#~/db/knex.js';
import { mustBeAdmin } from '#~/services/auth.js';

const getStats = async (request, response) => {
  await mustBeAdmin(request.currentUser);

  try {
    // Get total user count
    const totalUsers = await knex('user')
      .count('* as count')
      .first();

    // Get user registration stats by month (last 12 months)
    const userRegistrationStats = await knex('user')
      .select(knex.raw(`
        DATE_TRUNC('month', created_at) as month,
        COUNT(*) as count
      `))
      .where('created_at', '>=', knex.raw("NOW() - INTERVAL '12 months'"))
      .groupBy(knex.raw('DATE_TRUNC(\'month\', created_at)'))
      .orderBy('month', 'desc');

    // Get total course count
    const totalCourses = await knex('course')
      .count('* as count')
      .first();

    // Get public vs private course breakdown
    const courseVisibilityStats = await knex('course')
      .select('if_public')
      .count('* as count')
      .groupBy('if_public');

    // Get total problem count (flashcards)
    const totalProblems = await knex('problem')
      .count('* as count')
      .first();

    // Get problem type breakdown
    const problemTypeStats = await knex('problem')
      .select('type')
      .count('* as count')
      .groupBy('type')
      .orderBy('count', 'desc');

    // Get course categories stats
    const categoryStats = await knex('course_category')
      .join('course', 'course.course_category_id', 'course_category.id')
      .select('course_category.name as category_name')
      .count('course.id as course_count')
      .groupBy('course_category.id', 'course_category.name')
      .orderBy('course_count', 'desc');

    // Get learning engagement stats
    const totalLearningRelations = await knex('course_user_is_learning')
      .count('* as count')
      .first();

    const activeLearners = await knex('course_user_is_learning')
      .where('active', true)
      .count('* as count')
      .first();

    const totalProblemLearningProgress = await knex('problem_user_is_learning')
      .count('* as count')
      .first();

    // Get flashcard creation stats by month (all years)
    const flashcardCreationByMonth = await knex('problem')
      .select(knex.raw(`
        EXTRACT(MONTH FROM created_at) as month,
        COUNT(*) as count
      `))
      .groupBy(knex.raw('EXTRACT(MONTH FROM created_at)'))
      .orderBy('month', 'asc');

    // Get flashcard creation stats by day (last 30 days)
    const flashcardCreationByDay = await knex('problem')
      .select(knex.raw(`
        DATE(created_at) as date,
        COUNT(*) as count
      `))
      .where('created_at', '>=', knex.raw("NOW() - INTERVAL '30 days'"))
      .groupBy(knex.raw('DATE(created_at)'))
      .orderBy('date', 'desc');

    // Get flashcard review stats by month (all years) - using stats_problem_review table
    const flashcardReviewsByMonth = await knex('stats_problem_review')
      .select(knex.raw(`
        EXTRACT(MONTH FROM reviewed_at) as month,
        COUNT(*) as count
      `))
      .groupBy(knex.raw('EXTRACT(MONTH FROM reviewed_at)'))
      .orderBy('month', 'asc');

    // Get flashcard review stats by day (last 30 days)
    const flashcardReviewsByDay = await knex('stats_problem_review')
      .select(knex.raw(`
        DATE(reviewed_at) as date,
        COUNT(*) as count
      `))
      .where('reviewed_at', '>=', knex.raw("NOW() - INTERVAL '30 days'"))
      .groupBy(knex.raw('DATE(reviewed_at)'))
      .orderBy('date', 'desc');

    // Get course rating stats
    const ratingStats = await knex('course_rating')
      .select('rating')
      .count('* as count')
      .groupBy('rating')
      .orderBy('rating', 'asc');

    const avgRating = await knex('course_rating')
      .avg('rating as average')
      .first();

    // Get top course creators (top 10)
    const topCourseCreators = await knex('user')
      .join('course', 'user.id', 'course.user_id')
      .select('user.username', 'user.id as user_id')
      .count('course.id as course_count')
      .groupBy('user.id', 'user.username')
      .orderBy('course_count', 'desc')
      .limit(10);


    // Get recent activity stats (last 30 days)
    const recentStats = await knex.raw(`
      SELECT 
        (SELECT COUNT(*) FROM "user" WHERE created_at >= NOW() - INTERVAL '30 days') as new_users_30d,
        (SELECT COUNT(*) FROM course WHERE created_at >= NOW() - INTERVAL '30 days') as new_courses_30d,
        (SELECT COUNT(*) FROM problem WHERE created_at >= NOW() - INTERVAL '30 days') as new_problems_30d,
        (SELECT COUNT(*) FROM course_user_is_learning WHERE started_learning_at >= NOW() - INTERVAL '30 days') as new_learners_30d
    `);

    response.success({
      overview: {
        totalUsers: parseInt(totalUsers.count),
        totalCourses: parseInt(totalCourses.count),
        totalProblems: parseInt(totalProblems.count),
        totalLearningRelations: parseInt(totalLearningRelations.count),
        activeLearners: parseInt(activeLearners.count),
        totalProblemLearningProgress: parseInt(totalProblemLearningProgress.count)
      },
      userStats: {
        registrationByMonth: userRegistrationStats.map(stat => ({
          month: stat.month,
          count: parseInt(stat.count)
        }))
      },
      courseStats: {
        visibilityBreakdown: courseVisibilityStats.map(stat => ({
          isPublic: stat.ifPublic,
          count: parseInt(stat.count)
        })),
        categoryBreakdown: categoryStats.map(stat => ({
          categoryName: stat.categoryName,
          courseCount: parseInt(stat.courseCount)
        }))
      },
      problemStats: {
        typeBreakdown: problemTypeStats.map(stat => ({
          type: stat.type,
          count: parseInt(stat.count)
        })),
        creationByMonth: flashcardCreationByMonth.map(stat => ({
          month: parseInt(stat.month),
          count: parseInt(stat.count)
        })),
        creationByDay: flashcardCreationByDay.map(stat => ({
          date: stat.date,
          count: parseInt(stat.count)
        })),
        reviewsByMonth: flashcardReviewsByMonth.map(stat => ({
          month: parseInt(stat.month),
          count: parseInt(stat.count)
        })),
        reviewsByDay: flashcardReviewsByDay.map(stat => ({
          date: stat.date,
          count: parseInt(stat.count)
        }))
      },
      ratingStats: {
        breakdown: ratingStats.map(stat => ({
          rating: stat.rating,
          count: parseInt(stat.count)
        })),
        average: avgRating.average ? parseFloat(avgRating.average).toFixed(2) : null
      },
      topUsers: {
        courseCreators: topCourseCreators.map(creator => ({
          userId: creator.userId,
          username: creator.username,
          courseCount: parseInt(creator.courseCount)
        }))
      },
      recentActivity: recentStats.rows[0] ? {
        newUsers30d: parseInt(recentStats.rows[0].new_users_30d),
        newCourses30d: parseInt(recentStats.rows[0].new_courses_30d),
        newProblems30d: parseInt(recentStats.rows[0].new_problems_30d),
        newLearners30d: parseInt(recentStats.rows[0].new_learners_30d)
      } : {}
    });

  } catch (error) {
    console.error('Error fetching admin stats:', error);
    response.error('Failed to fetch admin statistics');
  }
};

export default getStats;