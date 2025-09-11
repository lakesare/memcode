import knex from '#~/db/knex.js';
import { mustBeAuthorOrCoauthor } from '#~/services/auth.js';

const update = async (request, response) => {
  const id = request.body['id'];
  const problemData = request.body['problem'];
  
  // Get problem to check course permission
  const problem = await knex('problem').where({ id }).first();
  await mustBeAuthorOrCoauthor(problem.courseId, request.currentUser);

  await knex('problem').where({ id }).update(problemData);

  response.success();
};

export default update;
