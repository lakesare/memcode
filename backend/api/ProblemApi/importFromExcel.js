import db from '~/db/init.js';
// import knex from '~/db/knex';

const importFromExcel = async (request, response) => {
  const courseId = request.body['courseId'];
  const problems = request.body['problems'];

  const arrayOfNulls = await db.tx((transaction) => {
    const queries = problems.map((problem, index) => {
      transaction.none(
        "INSERT INTO problem (type, content, course_id, created_at) VALUES (${type}, ${content}, ${courseId}, now())",
        {
          type: problem.type,
          content: problem.content,
          position: index + 1,
          courseId
        }
      );
    });
    return transaction.batch(queries);
  });

  response.success({ amountOfCreatedProblems: arrayOfNulls.length });
};

export default importFromExcel;
