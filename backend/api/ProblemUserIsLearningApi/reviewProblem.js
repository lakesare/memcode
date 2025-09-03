import knex from '#~/db/knex.js';
import dayjs from 'dayjs';

import guard from '#~/middlewares/guard.js';
import getNextScore from '../../../services/getNextScore.js';

const reviewProblem = guard((r) => ['byCuilId', r.body['id']])(async (request, response) => {
  const courseUserIsLearningId = request.body['id'];
  const problemId = request.body['problemId'];
  const performanceRating = request.body['performanceRating'];

  const puil = (await knex('problemUserIsLearning').where({ courseUserIsLearningId, problemId }))[0];
  const nextScore = getNextScore(puil.easiness, puil.consecutiveCorrectAnswers, performanceRating);
  const now = dayjs();
  const updatedPuil = (await knex('problemUserIsLearning')
    .where({ id: puil.id })
    .update({
      easiness: nextScore.easiness,
      consecutiveCorrectAnswers: nextScore.consecutiveCorrectAnswers,
      nextDueDate: now.add(nextScore.msToNextReview, 'ms').format(),
      lastReviewedAt: now.format()
    })
    .returning('*'))[0];
  response.success(updatedPuil);
});

export default reviewProblem;
