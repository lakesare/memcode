import knex from '#~/db/knex.js';
import { mustBeAbleToReadCourse } from '#~/services/auth.js';
import dayjs from 'dayjs';
import repetitions from '../../../services/repetitions.js';

const cantAccessError = "Sorry, this course is private. Only the author and coauthors and can access it.";

const getReviewPage = async (request, response) => {
  const courseId = request.body['courseId'];

  // Check if user can read the course (throws error if not allowed)
  await mustBeAbleToReadCourse(courseId, request.currentUser);

  const courseUserIsLearning = (await knex('courseUserIsLearning')
    .where({ courseId, userId: request.currentUser.id }))[0];

  const now = dayjs();

  const query = knex('problem')
    .select('problem.*')
    .join('problem_user_is_learning', {
      'problem_user_is_learning.problem_id': 'problem.id'
    })
    .where({
      'problem_user_is_learning.course_user_is_learning_id': courseUserIsLearning.id,
      'problem_user_is_learning.if_ignored': false
    })
    .orderBy('problem.position');

  // [claude comment] a fixed-interval course serves the earliest batch of overdue flashcards - what's left of the pass the user owes, rather than the whole course over again
  let problems;
  if (courseUserIsLearning.repeatEveryHours) {
    const rows = await query.select('problem_user_is_learning.next_due_date');

    problems = repetitions
      .problemsDueNow(rows, courseUserIsLearning.repeatEveryHours, now.valueOf())
      .map(({ nextDueDate, ...problem }) => problem);
  } else {
    problems = await query.andWhere('problem_user_is_learning.next_due_date', '<', now);
  }

  response.success({ courseUserIsLearning, problems });
};

export default getReviewPage;
