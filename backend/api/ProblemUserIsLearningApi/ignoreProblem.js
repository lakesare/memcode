import auth from '~/middlewares/auth';
import createPuil from './services/createPuil';

const ignoreProblem = auth(async (request, response) => {
  const problemId = request.body['problemId'];
  const userId = request.currentUser.id;

  const ignoredPuil = await createPuil(problemId, userId, { ifIgnored: true });

  response.success(ignoredPuil);
});

export default ignoreProblem;
