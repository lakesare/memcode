import knex from '#~/db/knex.js';

const deleteMany = async (request, response) => {
  const ids = request.body['ids'];

  // Get course_id before deletion to resequence positions
  const problemsToDelete = await knex('problem')
    .whereIn('id', ids)
    .select('course_id')
    .first();
    
  if (!problemsToDelete) {
    response.success();
    return;
  }
  
  const courseId = problemsToDelete.course_id;

  // Delete the problems
  await knex('problem')
    .whereIn('id', ids)
    .del();

  // Resequence remaining problems to maintain 1,2,3... order
  const remainingProblems = await knex('problem')
    .where({ course_id: courseId })
    .orderBy('position', 'asc')
    .select('id');
  
  // Update positions to be sequential starting from 1
  const updatePromises = remainingProblems.map((problem, index) =>
    knex('problem')
      .where({ id: problem.id })
      .update({ position: index + 1 })
  );
  
  await Promise.all(updatePromises);

  response.success();
};

export default deleteMany;
