import { db } from '../../db/init.js';

const create = (problem) =>
  db.one(
    "INSERT INTO problems (content, explanation, course_id, created_at) VALUES (${content}, ${explanation}, ${courseId}, ${created_at}) RETURNING *",
    {
      content: problem.content,
      explanation: problem.explanation,
      courseId: problem.courseId,
      created_at: new Date()
    }
  );

const update = (problem, problemId) =>
  db.one(
    "UPDATE problems SET content=${content}, explanation=${explanation} WHERE id=${id} RETURNING *",
    {
      content: problem.content,
      explanation: problem.explanation,
      id: problemId
    }
  );

const destroy = (id) =>
  db.none('delete from problems where id=${id}', { id });

export { create, update, destroy };
