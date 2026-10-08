import knex from '#~/db/knex.js';
import { mustBeAuthorOrCoauthor } from '#~/services/auth.js';
import hashProblem from '../../../services/hashProblem.js';

const update = async (request, response) => {
  const id = request.body['id'];
  const problemData = request.body['problem'];
  // [claude comment] hash of the version the edit started from - edits made offline can arrive long after someone else changed the same flashcard
  const baseHash = request.body['baseHash'];

  const problem = await knex('problem').where({ id }).first();
  if (!problem) return response.validation(['This flashcard was deleted.']);
  await mustBeAuthorOrCoauthor(problem.courseId, request.currentUser);

  const currentHash = hashProblem(problem);
  const newHash = hashProblem(problemData);

  await knex('problem').where({ id }).update({
    type: problemData.type,
    content: problemData.content
  });

  response.success({
    ifOverwroteOtherEdit: Boolean(baseHash) && currentHash !== baseHash && currentHash !== newHash
  });
};

export default update;
