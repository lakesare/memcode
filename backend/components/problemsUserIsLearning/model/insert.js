import { db } from '~/db/init.js';
import { requireKeys } from '~/services/requireKeys';
import { initialScore } from '../services/initialScore';

const insert = {
  create: requireKeys(['courseUserIsLearningId', 'problemId'],
    ({ courseUserIsLearningId, problemId, ifIgnored }) =>
      db.one(
        `
        INSERT INTO problem_user_is_learning
        (easiness, consecutive_correct_answers, next_due_date, course_user_is_learning_id, problem_id, if_ignored) VALUES
        (\${easiness}, \${consecutiveCorrectAnswers}, timezone('UTC', now()), \${courseUserIsLearningId}, \${problemId}, \${ifIgnored})
        RETURNING *
        `,
        {
          easiness: initialScore().easiness,
          consecutiveCorrectAnswers: initialScore().consecutiveCorrectAnswers,
          ifIgnored: ifIgnored || false,
          courseUserIsLearningId,
          problemId
        }
      )
  )
};

export { insert };
