import db from '~/db/init.js';
// import knex from '~/db/knex';

const importFromExcel = async (request, response) => {
  const courseId = request.body['courseId'];
  const problems = request.body['problems'];

  const createdProblemIds = await db.tx(async (transaction) => {
    // Always assign position=0 to imported cards
    // This ensures they appear at the end (after manually positioned cards)
    // and in chronological order based on created_at
    const queries = problems.map((problem, index) => {
      return transaction.one(
        "INSERT INTO problem (type, content, course_id, position, created_at) VALUES (${type}, ${content}, ${courseId}, ${position}, now()) RETURNING id",
        {
          type: problem.type,
          content: problem.content,
          courseId,
          position: 0
        }
      );
    });
    const results = await Promise.all(queries);
    return results.map(result => result.id);
  });

  response.success({ 
    amountOfCreatedProblems: createdProblemIds.length,
    createdProblemIds: createdProblemIds
  });
};

export default importFromExcel;
