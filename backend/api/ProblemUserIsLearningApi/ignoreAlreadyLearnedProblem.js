import { mustOwnCuil } from '#~/services/auth.js';
import knex from '#~/db/knex.js';

const ignoreAlreadyLearnedProblem = async (request, response) => {
  const problemId = request.body['problemId'];
  const courseUserIsLearningId = request.body['cuilId'];
  
  // Ensure user owns this course learning record
  await mustOwnCuil(courseUserIsLearningId, request.currentUser);

  await knex('problemUserIsLearning')
    .where({ problemId, courseUserIsLearningId })
    .update({ ifIgnored: true })

  response.success();
};

export default ignoreAlreadyLearnedProblem;
