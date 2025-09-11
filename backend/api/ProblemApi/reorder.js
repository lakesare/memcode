import knex from '#~/db/knex.js';
import { mustOwnAllProblemsInSameCourse } from '#~/services/auth.js';

const reorder = async (request, response) => {
  const idOrderMap = request.body;
  const problemIds = idOrderMap.map(item => item.id);
  
  // Validate all problems belong to same course and user has permission
  const courseId = await mustOwnAllProblemsInSameCourse(problemIds, request.currentUser);
  
  if (courseId === null) {
    return response.success(); // Empty array, nothing to do
  }

  const promises = idOrderMap.map(({ id, position }) =>
    knex('problem').where({ id }).update({ position })
  );

  await Promise.all(promises);

  response.success();
};

export default reorder;
