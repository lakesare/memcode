import db from '~/db/init.js';
import { requireKeys } from '~/services/requireKeys';

const insert = {
  // we don't need to create problem_user_is_learning for every user who learns this course, because problem_user_is_learning is only for already learnt problems
  create: requireKeys(['type', 'content', 'courseId'],
    ({ type, content, courseId }) =>
      db.one(
        "INSERT INTO problem (type, content, course_id, created_at) VALUES (${type}, ${content}, ${courseId}, now()) RETURNING *",
        {
          type,
          content,
          courseId
        }
      )
  ),

  createManyFromExcel: (courseId, problems) =>
    db.tx((transaction) => {
      const queries = problems.map((problem) =>
        transaction.none(
          "INSERT INTO problem (type, content, course_id, created_at) VALUES (${type}, ${content}, ${courseId}, now())",
          {
            type: 'separateAnswer',
            content: {
              content: problem.content,
              answer: problem.answer
            },
            courseId
          }
        )
      );
      return transaction.batch(queries);
    }),

  moveToCourseMany: (problemIds, courseId) => {
    const promises = problemIds.map((problemId) => {
      const problemPromise = db.one('SELECT * FROM problem WHERE id = ${problemId}', { problemId });
      return problemPromise.then((problem) =>
        Promise.all([
          insert.create({
            type: problem.type,
            content: problem.content,
            courseId
          }),
          db.none('delete from problem where id=${problemId}', { problemId })
        ])
      );
    });
    return Promise.all(promises);
  }
};

export default insert;
