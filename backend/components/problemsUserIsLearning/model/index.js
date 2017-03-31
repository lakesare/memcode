// CREATE TABLE problem_user_is_learning (
//   id SERIAL PRIMARY KEY,
// 
//   is_learned BOOLEAN,
// 
//   easiness SMALLINT, [A number ≥ 1.3 representing how easy the item is, with 1.3 being the hardest.  Defaults to 2.5]
// 
//   consecutive_correct_answers SMALLINT, [How many times in a row the user has correctly answered this item]
// 
//   nextDueDate TIMESTAMP, [The next time this item needs to be reviewed]
// 
//   problem_id INTEGER REFERENCES problem (id) ON DELETE CASCADE,
//   user_id INTEGER REFERENCES "user" (id) ON DELETE CASCADE,
//   unique (problem_id, user_id)
// );


import { db } from '~/db/init.js';

import { initialScore } from '../services/initialScore';
import { getNextScore } from '../services/getNextScore';

const select = {
  findByCuilIdAndProblemId: async (cuilId, problemId) =>
    db.one(
      `SELECT * FROM problem_user_is_learning
      WHERE course_user_is_learning_id = \${cuilId} AND problem_id = \${problemId}`,
      { cuilId, problemId }
    )
};

const update = {
  // solve particular problem
  // performanceRating: 0-5
  review: async (courseUserIsLearningId, problemId, performanceRating) => {
    const me = await select.findByCuilIdAndProblemId(courseUserIsLearningId, problemId);

    const nextScore = getNextScore(me.easiness, me.consecutiveCorrectAnswers, performanceRating);

    return db.one(
      `
      UPDATE problem_user_is_learning
      SET easiness = \${easiness},
          consecutive_correct_answers = \${consecutiveCorrectAnswers},
          next_due_date = timezone('UTC', (now() + '${nextScore.daysToNextReview} days'::INTERVAL))
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
};

const insert = {
  create: (courseUserIsLearningId, problemId) =>
    db.one(
      `
      INSERT INTO problem_user_is_learning
      (easiness, consecutive_correct_answers, next_due_date, course_user_is_learning_id, problem_id) VALUES
      (\${easiness}, \${consecutiveCorrectAnswers}, timezone('UTC', now()), \${courseUserIsLearningId}, \${problemId})
      RETURNING *
      `,
      {
        easiness: initialScore().easiness,
        consecutiveCorrectAnswers: initialScore().consecutiveCorrectAnswers,
        courseUserIsLearningId,
        problemId
      }
    )
};

export { insert, update };
