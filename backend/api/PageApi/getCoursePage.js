import { mustBeAbleToReadCourse } from '#~/services/auth.js';
import ProblemModel from '#~/models/ProblemModel.js';

const getCoursePage = async (request, response) => {
  const courseId = request.body['courseId'];

  // Check if user can read the course (throws error if not allowed)
  await mustBeAbleToReadCourse(courseId, request.currentUser);

  const problems = await ProblemModel.getProblemsByCourseId(courseId);

  response.success({ problems });
};

export default getCoursePage;
