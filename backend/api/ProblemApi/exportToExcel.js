import ProblemModel from '#~/models/ProblemModel.js';

const exportToExcel = async (request, response) => {
  const courseId = request.body['courseId'];
  const problems = await ProblemModel.getProblemsByCourseId(courseId);
  response.success(problems);
};

export default exportToExcel;
