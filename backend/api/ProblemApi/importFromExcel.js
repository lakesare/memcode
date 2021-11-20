import db from '~/db/init.js';
// import knex from '~/db/knex';

const importFromExcel = async (request, response) => {
  const courseId = request.body['courseId'];
  const problems = request.body['problems'];

  // We should always assign the goddamn position.
  // const currentlyNOfProblems = knex('problem').where({ course_id: courseId })
  //   // Put position-0 last (because it means they were created after the latest reordering!) (https://stackoverflow.com/a/3130216/3192470)
  //   .orderByRaw('position=0')
  //   .orderBy('position')
  //   .orderBy('createdAt', 'asc');

  const arrayOfNulls = await db.tx((transaction) => {
    const queries = problems.map((problem, index) =>
      transaction.none(
        "INSERT INTO problem (type, content, course_id, created_at) VALUES (${type}, ${content}, ${courseId}, now())",
        {
          type: 'separateAnswer',
          content: {
            content: problem.content,
            answer: problem.answer
          },
          position: index + 1,
          courseId
        }
      )
    );
    return transaction.batch(queries);
  });

  response.success({ amountOfCreatedProblems: arrayOfNulls.length });
};

export default importFromExcel;
