import { mustOwnCuil } from '#~/services/auth.js';
import knex from '#~/db/knex.js';

const unlearnAlreadyLearnedProblem = async (request, response) => {
  const problemId = request.body['problemId'];
  const courseUserIsLearningId = request.body['cuilId'];

  // Ensure user owns this course learning record
  await mustOwnCuil(courseUserIsLearningId, request.currentUser);

  await knex('problemUserIsLearning')
    .where({ problemId, courseUserIsLearningId })
    .del()

  response.success();
};

export default unlearnAlreadyLearnedProblem;
