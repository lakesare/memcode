import { db } from '~/db/init.js';

const insert = {
  // we don't need to create problem_user_is_learning for every user who learns this course, because problem_user_is_learning is only for already learnt problems
  create: (problem) =>
    db.one(
      "INSERT INTO problem (type, content, course_id, created_at) VALUES (${type}, ${content}, ${courseId}, ${createdAt}) RETURNING *",
      {
        type: problem.type,
        content: problem.content,
        courseId: problem.courseId,
        createdAt: new Date()
      }
    ),

  moveToCourse: async (problemId, courseId) => {
    const problem = await db.one('SELECT * FROM problem WHERE id = ${problemId}', { problemId });
    await insert.create({
      type: problem.type,
      content: problem.content,
      courseId
    });
    await db.none('delete from problem where id=${problemId}', { problemId });
  }
};

export { insert };
