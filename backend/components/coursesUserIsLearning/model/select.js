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
    ),

  // {
  //   1: {
  //     toLearn: [1, 3, 4],
  //     toReview: [5]
  //   },
  //   43: {
  //     toLearn: [],
  //     toReview: [2]
  //   }
  // }
  idsOfProblemsToLearnAndReviewPerCourse: async (userId) => {
    // all courses listed
    // => [{ id: 3, toReview: [] }, ...]
    const toReview = await db.any(
      `
      SELECT
        course.id AS id,
        COALESCE(json_agg(problem_user_is_learning.problem_id) FILTER (WHERE problem_user_is_learning.problem_id IS NOT NULL), '[]') AS to_review

      FROM course_user_is_learning

      INNER JOIN course
        ON course_user_is_learning.course_id = course.id

      LEFT JOIN problem_user_is_learning
        ON (
          problem_user_is_learning.course_user_is_learning_id = course_user_is_learning.id
          AND
          problem_user_is_learning.next_due_date < timezone('UTC', now())
        )

      WHERE
          course_user_is_learning.user_id = \${userId}
        AND
          course_user_is_learning.active = true
      GROUP BY course.id
      `,
      { userId }
    );

    // only those who have what to learn
    // => [{ id: 4, toLearn: [3, 65] }]
    const toLearn = await db.any(
      `
      SELECT
        course.id AS id,
        COALESCE(json_agg(DISTINCT problem.id) FILTER (WHERE problem.id IS NOT NULL), '[]') AS to_learn

      FROM course_user_is_learning

      INNER JOIN course
        ON course_user_is_learning.course_id = course.id

      LEFT JOIN problem
        ON problem.course_id = course.id

      WHERE
          course_user_is_learning.user_id = \${userId}
        AND
          course_user_is_learning.active = true
        AND
          -- problems in this course
          problem.id
          NOT IN
          -- minus problems user is already learning
          (
            SELECT problem_user_is_learning.problem_id
            FROM problem_user_is_learning
            WHERE problem_user_is_learning.course_user_is_learning_id = course_user_is_learning.id
          )
      GROUP BY course.id
      `,
      { userId }
    );

    const toLearnToReviewResponse = {};
    toReview.forEach((toReviewResponse) => {
      const correspondingToLearnResponse = toLearn
        .find((toLearnResponse) => toLearnResponse.id === toReviewResponse.id);

      toLearnToReviewResponse[toReviewResponse.id] = {
        toReview: toReviewResponse.toReview,
        toLearn: correspondingToLearnResponse ? correspondingToLearnResponse.toLearn : []
      };
    });

    return toLearnToReviewResponse;
  }
};

export { select };
