import knex from '#~/db/knex.js';
import canAccessCourse from '#~/services/canAccessCourse.js';
import ProblemModel from '#~/models/ProblemModel.js';

const cantAccessError = "Sorry, this course is private. Only the author and coauthors and can access it.";

const getLearnPage = async (request, response) => {
  const courseId = request.body['courseId'];

  if (!(await canAccessCourse(courseId, request.currentUser))) {
    return response.error(cantAccessError);
  }

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
