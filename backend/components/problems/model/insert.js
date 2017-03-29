import { db } from '~/db/init.js';

const insert = {
  // we don't need to create problem_user_is_learning for every user who learns this course, because problem_user_is_learning is only for already learnt problems
  create: (problem) =>
    db.one(
      "INSERT INTO problem (content, explanation, course_id, created_at) VALUES (${content}, ${explanation}, ${courseId}, ${created_at}) RETURNING *",
      {
        content: problem.content,
        explanation: problem.explanation,
        courseId: problem.courseId,
        created_at: new Date()
      }
    )
};

export { insert };
