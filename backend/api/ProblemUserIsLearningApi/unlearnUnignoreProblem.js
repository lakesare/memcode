import guard from '#~/middlewares/guard.js';
import knex from '#~/db/knex.js';

// Unignore flashcard, or unlearn flashcard
const unlearnUnignoreProblem = guard((r) => ['byPuilId', r.body['id']])(
  async (request, response) => {
    const puilId = request.body['id'];
    await knex('problemUserIsLearning').where({ id: puilId }).del();
    response.success();
  }
);

export default unlearnUnignoreProblem;
