import { db } from '~/db/init.js';

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

  problemsToLearn: (id) =>
    db.any(
      `
      SELECT *
      FROM problem
      WHERE problem.id NOT IN (
        SELECT problem_user_is_learning.problem_id
        FROM problem_user_is_learning
        WHERE problem_user_is_learning.course_user_is_learning_id = \${id}
      )
      AND problem.course_id = (
        SELECT course_user_is_learning.course_id
        FROM course_user_is_learning
        WHERE course_user_is_learning.id = \${id}
      )
      `,
      { id }
    ),

  problemsToReview: (id) =>
    db.any(
      `
      SELECT *
      FROM problem
      WHERE problem.id IN (
        SELECT problem_user_is_learning.problem_id
        FROM problem_user_is_learning
        WHERE (
          problem_user_is_learning.course_user_is_learning_id = \${id}
          AND
          problem_user_is_learning.next_due_date < timezone('UTC', now())
        )
      )
      `,
      { id }
    )
};

export { select };
