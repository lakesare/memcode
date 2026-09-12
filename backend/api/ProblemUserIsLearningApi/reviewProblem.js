import knex from '#~/db/knex.js';
import dayjs from 'dayjs';
import { mustOwnCuil } from '#~/services/auth.js';
import getNextScore from '../../../services/getNextScore.js';
import repetitions from '../../../services/repetitions.js';

const reviewProblem = async (request, response) => {
  const courseUserIsLearningId = request.body['id'];
  
  // Ensure user owns this learning record
  await mustOwnCuil(courseUserIsLearningId, request.currentUser);
  const problemId = request.body['problemId'];
  const performanceRating = request.body['performanceRating'];

  const puil = (await knex('problemUserIsLearning').where({ courseUserIsLearningId, problemId }))[0];
  const nextScore = getNextScore(puil.easiness, puil.consecutiveCorrectAnswers, performanceRating);
  const now = dayjs();

  // [claude comment] a fixed-interval course keeps its own rhythm - how well it went doesn't change when the flashcard comes back (services/repetitions.js)
  const cuil = await knex('courseUserIsLearning').where({ id: courseUserIsLearningId }).first();
  let nextDueDate;
  if (cuil.repeatEveryHours) {
    const wholeCourse = await knex('problemUserIsLearning')
      .where({ courseUserIsLearningId, ifIgnored: false });

    nextDueDate = repetitions.nextDueDateAfterReview(
      wholeCourse, puil, cuil.repeatEveryHours, now.valueOf()
    );
  } else {
    nextDueDate = now.add(nextScore.msToNextReview, 'ms').toDate();
  }
  
  // Update the problem learning record
  const updatedPuil = (await knex('problemUserIsLearning')
    .where({ id: puil.id })
    .update({
      easiness: nextScore.easiness,
      consecutiveCorrectAnswers: nextScore.consecutiveCorrectAnswers,
      nextDueDate,
      lastReviewedAt: now.format()
    })
    .returning('*'))[0];
  
  // Log the review event for analytics
  await knex('stats_problem_review').insert({
    problem_id: problemId,
    user_id: request.currentUser.id,
    was_correct: performanceRating >= 4, // Same logic as isAnswerCorrect in getNextScore
    reviewed_at: now.format()
  });
  
  response.success(updatedPuil);
};

export default reviewProblem;
