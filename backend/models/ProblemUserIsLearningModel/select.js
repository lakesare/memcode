import db from '~/db/init.js';

const select = {
  allByCuilId: (cuilId) =>
    db.any(
      `
      SELECT *
      FROM problem_user_is_learning
      WHERE
        problem_user_is_learning.course_user_is_learning_id = \${cuilId}
      `,
      { cuilId }
    ),

  findByCuilIdAndProblemId: (cuilId, problemId) =>
    db.one(
      `SELECT * FROM problem_user_is_learning
      WHERE course_user_is_learning_id = \${cuilId} AND problem_id = \${problemId}`,
      { cuilId, problemId }
    )
};

export { select };
