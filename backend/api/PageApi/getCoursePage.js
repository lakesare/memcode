import knex from '#~/db/knex.js';
import { mustBeAbleToReadCourse } from '#~/services/auth.js';
import ProblemModel from '#~/models/ProblemModel.js';

const getCoursePage = async (request, response) => {
  const courseId = request.body['courseId'];

  // Check if user can read the course (throws error if not allowed)
  await mustBeAbleToReadCourse(courseId, request.currentUser);

  const problems = await ProblemModel.getProblemsByCourseId(courseId);

  const courseUserIsLearning = request.currentUser ?
    (await knex('courseUserIsLearning').where({ courseId, userId: request.currentUser.id, active: true }))[0] :
    undefined;

  const problemUserIsLearnings = courseUserIsLearning ?
    await knex('problemUserIsLearning').where({ courseUserIsLearningId: courseUserIsLearning.id }) :
    [];

  response.success({ problems, problemUserIsLearnings, ifLearningCourse: Boolean(courseUserIsLearning) });
};

export default getCoursePage;
