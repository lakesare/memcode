import { db } from '../../db/init.js';

const create = (problem) =>
  db.one(
    "INSERT INTO problems (content, explanation, course_id) VALUES (${content}, ${explanation}, ${courseId}) RETURNING *",
    {
      content: problem.content,
      explanation: problem.explanation,
      courseId: problem.courseId
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
