import knex from '#~/db/knex.js';
import canAccessCourse from '#~/services/canAccessCourse.js';

const cantAccessError = "Sorry, this course is private. Only the author and coauthors and can access it.";

const getLearnedProblemsByCuilId = (cuilId) =>
  knex('problem').select('problem.*')
    .innerJoin('problemUserIsLearning', { 'problemUserIsLearning.problemId': 'problem.id' })
    .where({
      'problemUserIsLearning.courseUserIsLearningId': cuilId,
      'problemUserIsLearning.ifIgnored': false
    })
    .orderBy('problem.position');

const getReviewPersistentPage = async (request, response) => {
  const courseId = request.body['courseId'];

  if (!(await canAccessCourse(courseId, request.currentUser))) {
    return response.error(cantAccessError);
  }

  const courseUserIsLearning = (await knex('courseUserIsLearning')
    .where({ courseId, userId: request.currentUser.id }))[0];
  const problems = await getLearnedProblemsByCuilId(courseUserIsLearning.id);
  response.success({ courseUserIsLearning, problems });
};

export default getReviewPersistentPage;
