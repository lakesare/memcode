import guard from '~/middlewares/guard';
import knex from '~/db/knex';

// Unignore flashcard, or unlearn flashcard
const unlearnUnignoreProblem = guard((r) => ['byPuilId', r.body['id']])(
  async (request, response) => {
    const puilId = request.body['id'];
    await knex('problemUserIsLearning').where({ id: puilId }).del();
    response.success();
  }
);

export default unlearnUnignoreProblem;
