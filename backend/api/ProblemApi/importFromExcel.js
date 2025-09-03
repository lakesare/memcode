import db from '#~/db/init.js';
// import knex from '#~/db/knex.js';

const importFromExcel = async (request, response) => {
  const courseId = request.body['courseId'];
  const problems = request.body['problems'];

  const createdProblemIds = await db.tx(async (transaction) => {
    // Get the current maximum position for this course
    const maxPositionResult = await transaction.oneOrNone(
      "SELECT COALESCE(MAX(position), 0) as max_position FROM problem WHERE course_id = ${courseId}",
      { courseId }
    );
    const maxPosition = maxPositionResult ? parseInt(maxPositionResult.max_position, 10) || 0 : 0;
    
    // If there are position=0 cards, we need to assign them proper positions first
    const zeroPositionCount = await transaction.oneOrNone(
      "SELECT COUNT(*) as count FROM problem WHERE course_id = ${courseId} AND position = 0",
      { courseId }
    );
    
    let startingPosition;
    if (zeroPositionCount && parseInt(zeroPositionCount.count, 10) > 0) {
      // There are position=0 cards, assign them positions starting after maxPosition
      const zeroPositionProblems = await transaction.many(
        "SELECT id FROM problem WHERE course_id = ${courseId} AND position = 0 ORDER BY created_at ASC",
        { courseId }
      );
      
      // Assign positions to existing position=0 cards
      for (let i = 0; i < zeroPositionProblems.length; i++) {
        await transaction.none(
          "UPDATE problem SET position = ${position} WHERE id = ${id}",
          {
            position: maxPosition + 1 + i,
            id: zeroPositionProblems[i].id
          }
        );
      }
      
      // Start new imports after the reassigned cards
      startingPosition = maxPosition + 1 + zeroPositionProblems.length;
    } else {
      // No position=0 cards, start after the current max
      startingPosition = maxPosition + 1;
    }
    
    // Create new problems with proper sequential positions
    const results = [];
    for (let index = 0; index < problems.length; index++) {
      const problem = problems[index];
      const result = await transaction.one(
        "INSERT INTO problem (type, content, course_id, position, created_at) VALUES (${type}, ${content}, ${courseId}, ${position}, now()) RETURNING id",
        {
          type: problem.type,
          content: problem.content,
          courseId,
          position: startingPosition + index
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
