import { mustBeAuthenticated } from '#~/services/auth.js';
import createPuil from './services/createPuil.js';

const learnProblem = async (request, response) => {
  await mustBeAuthenticated(request.currentUser);
  const problemId = request.body['problemId'];
  const userId = request.currentUser.id;

  const createdPuil = await createPuil(problemId, userId, { ifIgnored: false });

  response.success(createdPuil);
};

export default learnProblem;
