import knex from '#~/db/knex.js';
import dayjs from 'dayjs';
import { mustOwnCuil } from '#~/services/auth.js';

const makeAllProblemsDue = async (request, response) => {
  const courseUserIsLearningId = request.body['id'];

  await mustOwnCuil(courseUserIsLearningId, request.currentUser);

  const amountOfProblems = await knex('problemUserIsLearning')
    .where({ courseUserIsLearningId, ifIgnored: false })
    .update({ nextDueDate: dayjs().toDate() });

  response.success({ amountOfProblems });
};

export default makeAllProblemsDue;
