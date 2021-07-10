import db from '~/db/init.js';

const importFromExcel = async (request, response) => {
  const courseId = request.body['courseId'];
  const problems = request.body['problems'];

  const arrayOfNulls = await db.tx((transaction) => {
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
  });

  response.success({ amountOfCreatedProblems: arrayOfNulls.length });
};

export default importFromExcel;
