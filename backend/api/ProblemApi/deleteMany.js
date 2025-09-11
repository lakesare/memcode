import knex from '#~/db/knex.js';
import { mustOwnAllProblemsInSameCourse } from '#~/services/auth.js';

const deleteMany = async (request, response) => {
  const ids = request.body['ids'];

  // Validate all problems belong to same course and user has permission
  const courseId = await mustOwnAllProblemsInSameCourse(ids, request.currentUser);
  
  if (courseId === null) {
    return response.success(); // Empty array, nothing to do
  }

  // Delete the problems
  await knex('problem')
    .whereIn('id', ids)
    .del();

  // Resequence remaining problems to maintain 1,2,3... order
  const remainingProblems = await knex('problem')
    .where({ courseId })
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
