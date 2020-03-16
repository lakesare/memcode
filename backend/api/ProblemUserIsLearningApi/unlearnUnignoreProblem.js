import auth from '~/middlewares/auth';
import ProblemUserIsLearningModel from '~/models/ProblemUserIsLearningModel';

// == unignore, unlearn
const unlearnUnignoreProblem = auth(async (request, response) => {
  const puilId = request.body['id'];
  await ProblemUserIsLearningModel.delete.ddelete(puilId);
  response.success({});
});

export default unlearnUnignoreProblem;
