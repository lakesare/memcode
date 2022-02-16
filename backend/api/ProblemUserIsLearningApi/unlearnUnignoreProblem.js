import auth from '~/middlewares/auth';
import knex from '~/db/knex';

// Unignore flashcard, or unlearn flashcard
const unlearnUnignoreProblem = auth(async (request, response) => {
  const puilId = request.body['id'];
  await knex('problemUserIsLearning').where({ id: puilId }).del();
  response.success();
});

export default unlearnUnignoreProblem;
