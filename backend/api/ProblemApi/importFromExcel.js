import db from '~/db/init.js';
// import knex from '~/db/knex';

const importFromExcel = async (request, response) => {
  const courseId = request.body['courseId'];
  const problems = request.body['problems'];

  const arrayOfNulls = await db.tx(async (transaction) => {
    const queries = problems.map((problem, index) => {
      return transaction.none(
        "INSERT INTO problem (type, content, course_id, position, created_at) VALUES (${type}, ${content}, ${courseId}, ${position}, now())",
        {
          type: problem.type,
          content: problem.content,
          courseId,
          position: index + 1
        }
      );
    });
    return Promise.all(queries);
  });

  response.success({ amountOfCreatedProblems: arrayOfNulls.length });
};

export default importFromExcel;
