import db from '~/db/init.js';
import getNextScore from './services/getNextScore';
import ProblemUserIsLearningModel from '~/models/ProblemUserIsLearningModel';

const update = {
  // solve particular problem
  // performanceRating: 0-5
  review: async (courseUserIsLearningId, problemId, performanceRating) => {
    const me = await ProblemUserIsLearningModel.select.findByCuilIdAndProblemId(courseUserIsLearningId, problemId);
    const nextScore = getNextScore(me.easiness, me.consecutiveCorrectAnswers, performanceRating);

    return db.one(
      `
      UPDATE problem_user_is_learning
      SET easiness = \${easiness},
          consecutive_correct_answers = \${consecutiveCorrectAnswers},
          next_due_date = timezone('UTC', (now() + '${nextScore.daysToNextReview} days'::INTERVAL)),
          last_reviewed_at = timezone('UTC', now())
      WHERE id = \${id}
      RETURNING *
      `,
      {
        easiness: nextScore.easiness,
        consecutiveCorrectAnswers: nextScore.consecutiveCorrectAnswers,
        id: me.id
      }
    );
  },

  ignore: (id) =>
    db.one(
      `
      UPDATE problem_user_is_learning
      SET if_ignored = true
      WHERE id = \${id}
      RETURNING *
      `,
      { id }
    )
};

export default update;
