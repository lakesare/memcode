import { mustBeAbleToReadCourse } from '#~/services/auth.js';
import ProblemModel from '#~/models/ProblemModel.js';


const getReviewSimulatedPage = async (request, response) => {
  const courseId = request.body['courseId'];

  await mustBeAbleToReadCourse(courseId, request.currentUser);

  const problems = await ProblemModel.getProblemsByCourseId(courseId);
  response.success({ courseUserIsLearning: null, problems });
};

export default getReviewSimulatedPage;
