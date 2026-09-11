import { mustBeAbleToReadCourse } from '#~/services/auth.js';
import ProblemModel from '#~/models/ProblemModel.js';


const getReviewSimulatedPage = async (request, response) => {
  const courseId = request.body['courseId'];

  // Check if user can read the course (throws error if not allowed)
  await mustBeAbleToReadCourse(courseId, request.currentUser);

  const problems = await ProblemModel.getProblemsByCourseId(courseId);
  response.success({ courseUserIsLearning: null, problems });
};

export default getReviewSimulatedPage;
