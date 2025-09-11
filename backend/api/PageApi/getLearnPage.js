import knex from '#~/db/knex.js';
import { mustBeAbleToReadCourse } from '#~/services/auth.js';
import ProblemModel from '#~/models/ProblemModel.js';

const getLearnPage = async (request, response) => {
  const courseId = request.body['courseId'];

  // Check if user can read the course (throws error if not allowed)
  await mustBeAbleToReadCourse(courseId, request.currentUser);

  // find cuil
  const courseUserIsLearning = (await knex('courseUserIsLearning')
    .where({ courseId, userId: request.currentUser.id }))[0];

  // find problems
  const problems = await ProblemModel.getProblemsByCourseId(courseId);
  const problemUserIsLearnings = await knex('problemUserIsLearning')
    .where('course_user_is_learning_id', courseUserIsLearning.id);

  response.success({ courseUserIsLearning, problems, problemUserIsLearnings });
};

export default getLearnPage;
