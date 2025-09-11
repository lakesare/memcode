import { mustOwnPuil } from '#~/services/auth.js';
import knex from '#~/db/knex.js';

// Unignore flashcard, or unlearn flashcard
const unlearnUnignoreProblem = async (request, response) => {
  const puilId = request.body['id'];
  
  // Ensure user owns this problem learning record
  await mustOwnPuil(puilId, request.currentUser);
  
  // Delete the record
  await knex('problemUserIsLearning').where({ id: puilId }).del();
  response.success();
};

export default unlearnUnignoreProblem;
