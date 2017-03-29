// CREATE TABLE problem_user_is_learning (
//   id SERIAL PRIMARY KEY,

//   is_learned BOOLEAN,

//   easiness SMALLINT,
//   consecutive_correct_answers SMALLINT,
//   nextDueDate TIMESTAMP,

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
  review: async (courseUserIsLearningId, problemId, performanceRating) => {
    const me = await select.findByCuilIdAndProblemId(courseUserIsLearningId, problemId);

    const nextScore = getNextScore(me, performanceRating);

    return db.none(
      "UPDATE problem_user_is_learning \
      SET easiness = ${easiness}, \
          consecutive_correct_answers = ${consecutiveCorrectAnswers}, \
          next_due_date = ${nextDueDate} \
      WHERE id = ${id}",
      {
        ...nextScore,
        id: me.id
      }
    );
  },
};

const insert = {
  create: (courseUserIsLearningId, problemId) =>
    db.none(
      "INSERT INTO problem_user_is_learning \
      (easiness, consecutive_correct_answers, next_due_date, course_user_is_learning_id, problem_id) VALUES \
      (${easiness}, ${consecutiveCorrectAnswers}, ${nextDueDate}, ${courseUserIsLearningId}, ${problemId}) \
      ",
      {
        ...initialScore(),
        courseUserIsLearningId,
        problemId
      }
    )
};

export { insert, update };
