import knex from '#~/db/knex.js';
import canAccessCourse from '#~/services/canAccessCourse.js';
import ProblemUserIsLearningModel from '#~/models/ProblemUserIsLearningModel/index.js'
import getProblemsByCourseId from '#~/api/services/getProblemsByCourseId.js';

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
  const problems = await getProblemsByCourseId(courseId);
  const problemUserIsLearnings = await ProblemUserIsLearningModel.select.allByCuilId(courseUserIsLearning.id);

  response.success({ courseUserIsLearning, problems, problemUserIsLearnings });
};

export default getLearnPage;
