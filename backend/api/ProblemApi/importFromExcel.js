import knex from '#~/db/knex.js';
import { mustBeAuthorOrCoauthor } from '#~/services/auth.js';

const importFromExcel = async (request, response) => {
  const courseId = request.body['courseId'];
  const problems = request.body['problems'];
  
  // Only course authors and coauthors can import problems
  await mustBeAuthorOrCoauthor(courseId, request.currentUser);

  const createdProblemIds = await knex.transaction(async (trx) => {
    // Create new problems with proper sequential positions
    const results = [];
    for (let index = 0; index < problems.length; index++) {
      const problem = problems[index];
      
      // Get the current maximum position for this course (fresh each time)
      const maxPositionResult = await trx('problem')
        .where({ course_id: courseId })
        .max('position as max_position')
        .first();
        
      const maxPosition = maxPositionResult ? parseInt(maxPositionResult.maxPosition, 10) || 0 : 0;
      const nextPosition = maxPosition + 1;
      
      const result = await trx('problem')
        .insert({
          type: problem.type,
          content: problem.content,
          course_id: courseId,
          position: nextPosition,
          created_at: knex.fn.now()
        })
        .returning('*');
        
      results.push(result[0].id);
    }
    
    return results;
  });

  response.success({ 
    amountOfCreatedProblems: createdProblemIds.length,
    createdProblemIds: createdProblemIds
  });
};

export default importFromExcel;
