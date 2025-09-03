import getProblemsByCourseId from '#~/api/services/getProblemsByCourseId.js';

const exportToExcel = async (request, response) => {
  const courseId = request.body['courseId'];
  const problems = await getProblemsByCourseId(courseId);
  response.success(problems);
};

export default exportToExcel;
