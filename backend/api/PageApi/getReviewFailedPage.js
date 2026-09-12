import knex from '#~/db/knex.js';
import { mustBeAbleToReadCourse } from '#~/services/auth.js';


// [claude comment] the failed pile lives in the browser, so its flashcard ids arrive from the client - scoping the query to this user's own learning record is what stops them asking for anything else
const getReviewFailedPage = async (request, response) => {
  const courseId = request.body['courseId'];
  const problemIds = request.body['problemIds'];

  // Check if user can read the course (throws error if not allowed)
  await mustBeAbleToReadCourse(courseId, request.currentUser);

  const courseUserIsLearning = (await knex('courseUserIsLearning')
    .where({ courseId, userId: request.currentUser.id }))[0];

  const problems = await knex('problem')
    .select('problem.*')
    .join('problem_user_is_learning', {
      'problem_user_is_learning.problem_id': 'problem.id'
    })
    .where({
      'problem_user_is_learning.course_user_is_learning_id': courseUserIsLearning.id,
      'problem_user_is_learning.if_ignored': false
    })
    .whereIn('problem.id', problemIds ? problemIds : [])
    .orderBy('problem.position');

  response.success({ courseUserIsLearning, problems });
};

export default getReviewFailedPage;
