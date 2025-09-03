import auth from '#~/middlewares/auth.js';
import createPuil from './services/createPuil.js';

const learnProblem = auth(async (request, response) => {
  const problemId = request.body['problemId'];
  const userId = request.currentUser.id;

  const createdPuil = await createPuil(problemId, userId, { ifIgnored: false });

  response.success(createdPuil);
});

export default learnProblem;
