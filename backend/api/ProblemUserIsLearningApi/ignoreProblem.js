import auth from '#~/middlewares/auth.js';
import createPuil from './services/createPuil.js';

const ignoreProblem = auth(async (request, response) => {
  const problemId = request.body['problemId'];
  const userId = request.currentUser.id;

  const ignoredPuil = await createPuil(problemId, userId, { ifIgnored: true });

  response.success(ignoredPuil);
});

export default ignoreProblem;
