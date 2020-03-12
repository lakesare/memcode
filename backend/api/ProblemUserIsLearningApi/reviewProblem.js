import auth from '~/middlewares/auth';
import ProblemUserIsLearningModel from '~/models/ProblemUserIsLearningModel';

const reviewProblem = auth(async (request, response) => {
  const puil = await ProblemUserIsLearningModel.update.review(
    request.body['id'],
    request.body['problemId'],
    request.body['performanceRating']
  );

  response.success(puil);
});

export default reviewProblem;
