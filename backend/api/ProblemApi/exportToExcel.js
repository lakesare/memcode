import ProblemModel from '#~/models/ProblemModel.js';
import { mustBeAuthorOrCoauthor } from '#~/services/auth.js';

const exportToExcel = async (request, response) => {
  const courseId = request.body['courseId'];

  await mustBeAuthorOrCoauthor(courseId, request.currentUser);

  const problems = await ProblemModel.getProblemsByCourseId(courseId);
  response.success(problems);
};

export default exportToExcel;
