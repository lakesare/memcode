import knex from '#~/db/knex.js';
import { mustBeAbleToReadCourse } from '#~/services/auth.js';

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

  // Check if user can read the course (throws error if not allowed)
  await mustBeAbleToReadCourse(courseId, request.currentUser);

  const courseUserIsLearning = (await knex('courseUserIsLearning')
    .where({ courseId, userId: request.currentUser.id }))[0];
  const problems = await getLearnedProblemsByCuilId(courseUserIsLearning.id);
  response.success({ courseUserIsLearning, problems });
};

export default getReviewPersistentPage;
