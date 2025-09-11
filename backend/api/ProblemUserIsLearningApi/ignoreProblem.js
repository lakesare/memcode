import { mustBeAuthenticated } from '#~/services/auth.js';
import createPuil from './services/createPuil.js';

const ignoreProblem = async (request, response) => {
  await mustBeAuthenticated(request.currentUser);
  const problemId = request.body['problemId'];
  const userId = request.currentUser.id;

  const ignoredPuil = await createPuil(problemId, userId, { ifIgnored: true });

  response.success(ignoredPuil);
};

export default ignoreProblem;
