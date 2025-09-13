import knex from '#~/db/knex.js';
import { mustBeAdmin } from '#~/services/auth.js';

const getStats = async (request, response) => {
  await mustBeAdmin(request.currentUser);

  try {
    // Get total user count
    const totalUsers = await knex('user')
      .count('* as count')
      .first();

    // Get comprehensive monthly stats for all time
    const monthlyStats = await knex.raw(`
      WITH months AS (
        SELECT DISTINCT DATE_TRUNC('month', created_at) as month
        FROM (
          SELECT created_at FROM "user"
          UNION
          SELECT created_at FROM course
          UNION
          SELECT created_at FROM problem
        ) all_dates
      )
      SELECT 
        months.month,
        COALESCE(users.count, 0) as users_created,
        COALESCE(courses.count, 0) as courses_created,
        COALESCE(problems.count, 0) as flashcards_created,
        COALESCE(reviews.count, 0) as flashcards_reviewed
      FROM months
      LEFT JOIN (
        SELECT DATE_TRUNC('month', created_at) as month, COUNT(*) as count
        FROM "user" GROUP BY DATE_TRUNC('month', created_at)
      ) users ON months.month = users.month
      LEFT JOIN (
        SELECT DATE_TRUNC('month', created_at) as month, COUNT(*) as count
        FROM course GROUP BY DATE_TRUNC('month', created_at)
      ) courses ON months.month = courses.month
      LEFT JOIN (
        SELECT DATE_TRUNC('month', created_at) as month, COUNT(*) as count
        FROM problem GROUP BY DATE_TRUNC('month', created_at)
      ) problems ON months.month = problems.month
      LEFT JOIN (
        SELECT DATE_TRUNC('month', reviewed_at) as month, COUNT(*) as count
        FROM stats_problem_review GROUP BY DATE_TRUNC('month', reviewed_at)
      ) reviews ON months.month = reviews.month
      ORDER BY months.month DESC
    `);

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




    // Get top course creators (top 10)
    const topCourseCreators = await knex('user')
      .join('course', 'user.id', 'course.user_id')
      .select('user.username', 'user.id as user_id')
      .count('course.id as course_count')
      .groupBy('user.id', 'user.username')
      .orderBy('course_count', 'desc')
      .limit(10);

    // Get recent flashcard reviews timeline (last 300 reviews, excluding lakesare)
    const recentReviews = await knex('stats_problem_review')
      .join('user', 'stats_problem_review.user_id', 'user.id')
      .join('problem', 'stats_problem_review.problem_id', 'problem.id')
      .join('course', 'problem.course_id', 'course.id')
      .where('user.username', '!=', 'lakesare')
      .select(
        'stats_problem_review.reviewed_at',
        'user.username',
        'user.id as user_id',
        'course.title as course_title',
        'course.id as course_id',
        'problem.content as problem_content',
        'stats_problem_review.was_correct'
      )
      .orderBy('stats_problem_review.reviewed_at', 'desc')
      .limit(300);



    response.success({
      overview: {
        totalUsers: parseInt(totalUsers.count),
        totalCourses: parseInt(totalCourses.count),
        totalProblems: parseInt(totalProblems.count)
      },
      monthlyStats: monthlyStats.rows.map(stat => ({
        month: stat.month,
        usersCreated: parseInt(stat.users_created),
        coursesCreated: parseInt(stat.courses_created),
        flashcardsCreated: parseInt(stat.flashcards_created),
        flashcardsReviewed: parseInt(stat.flashcards_reviewed)
      })),
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
        }))
      },
      topUsers: {
        courseCreators: topCourseCreators.map(creator => ({
          userId: creator.userId,
          username: creator.username,
          courseCount: parseInt(creator.courseCount)
        }))
      },
      recentReviews: recentReviews.map(review => ({
        reviewedAt: review.reviewedAt,
        username: review.username,
        userId: review.userId,
        courseTitle: review.courseTitle,
        courseId: review.courseId,
        problemContent: review.problemContent,
        wasCorrect: review.wasCorrect
      })),
    });

  } catch (error) {
    console.error('Error fetching admin stats:', error);
    response.error('Failed to fetch admin statistics');
  }
};

export default getStats;