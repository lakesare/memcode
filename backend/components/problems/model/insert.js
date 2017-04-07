import { db } from '~/db/init.js';

const insert = {
  // we don't need to create problem_user_is_learning for every user who learns this course, because problem_user_is_learning is only for already learnt problems
  create: (problem) =>
    db.one(
      "INSERT INTO problem (type, content, course_id, created_at) VALUES (${type}, ${content}, ${courseId}, ${created_at}) RETURNING *",
      {
        type: problem.type,
        content: problem.content,
        courseId: problem.courseId,
        created_at: new Date()
      }
    )
};

export { insert };
