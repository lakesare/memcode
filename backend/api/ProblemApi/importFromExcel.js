import db from '#~/db/init.js';
// import knex from '#~/db/knex.js';

const importFromExcel = async (request, response) => {
  const courseId = request.body['courseId'];
  const problems = request.body['problems'];

  const createdProblemIds = await db.tx(async (transaction) => {
    // Create new problems with proper sequential positions
    const results = [];
    for (let index = 0; index < problems.length; index++) {
      const problem = problems[index];
      
      // Get the current maximum position for this course (fresh each time)
      const maxPositionResult = await transaction.oneOrNone(
        "SELECT COALESCE(MAX(position), 0) as max_position FROM problem WHERE course_id = ${courseId}",
        { courseId }
      );
      const maxPosition = maxPositionResult ? parseInt(maxPositionResult.max_position, 10) || 0 : 0;
      const nextPosition = maxPosition + 1;
      
      const result = await transaction.one(
        "INSERT INTO problem (type, content, course_id, position, created_at) VALUES (${type}, ${content}, ${courseId}, ${position}, now()) RETURNING id",
        {
          type: problem.type,
          content: problem.content,
          courseId,
          position: nextPosition
        }
      );
      results.push(result);
    }
    
    return results.map(result => result.id);
  });

  response.success({ 
    amountOfCreatedProblems: createdProblemIds.length,
    createdProblemIds: createdProblemIds
  });
};

export default importFromExcel;
