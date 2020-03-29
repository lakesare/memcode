import db from '~/db/init.js';

const select = {
  oneByCourseIdAndUserId: (courseId, userId) =>
    db.one(
      `
        SELECT *
        FROM course_user_is_learning
        WHERE course_id = \${courseId} AND user_id = \${userId}
      `,
      { courseId, userId }
    ),

  problemsToReview: (cuilId) =>
    db.any(
      `
      SELECT problem.*
      FROM problem
      INNER JOIN problem_user_is_learning
      ON problem_user_is_learning.problem_id = problem.id
      WHERE
          problem_user_is_learning.course_user_is_learning_id = \${cuilId}
        AND
          problem_user_is_learning.next_due_date < now()
        AND
          problem_user_is_learning.if_ignored = false
      ORDER BY problem.position, problem.created_at
      `,
      { cuilId }
    )
};

export default select;
