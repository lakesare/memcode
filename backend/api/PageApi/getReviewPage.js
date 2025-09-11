import knex from '#~/db/knex.js';
import { mustBeAbleToReadCourse } from '#~/services/auth.js';
import dayjs from 'dayjs';

const cantAccessError = "Sorry, this course is private. Only the author and coauthors and can access it.";

const getReviewPage = async (request, response) => {
  const courseId = request.body['courseId'];

  // Check if user can read the course (throws error if not allowed)
  await mustBeAbleToReadCourse(courseId, request.currentUser);

  const courseUserIsLearning = (await knex('courseUserIsLearning')
    .where({ courseId, userId: request.currentUser.id }))[0];

  const now = dayjs();

  const problems = await knex('problem')
    .select('problem.*')
    .join('problem_user_is_learning', {
      'problem_user_is_learning.problem_id': 'problem.id'
    })
    .where({ 
      'problem_user_is_learning.course_user_is_learning_id': courseUserIsLearning.id,
      'problem_user_is_learning.if_ignored': false
    })
    .andWhere('problem_user_is_learning.next_due_date', '<', now)
    .orderBy('problem.position');
  
  response.success({ courseUserIsLearning, problems });

};

export default getReviewPage;
