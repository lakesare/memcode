import knex from '#~/db/knex.js';
import initialScore from '../../../../services/initialScore.js';
import repetitions from '../../../../services/repetitions.js';

const createPuil = async (problemId, userId, { ifIgnored }) => {
  const problem = (await knex('problem').where({ id: problemId }))[0];
  const courseUserIsLearning = (await knex('courseUserIsLearning')
    .where({ courseId: problem.courseId, userId })
  )[0];

  const learnedPuils = courseUserIsLearning.repeatEveryHours ?
    await knex('problemUserIsLearning')
      .select('nextDueDate')
      .where({ courseUserIsLearningId: courseUserIsLearning.id, ifIgnored: false }) :
    [];

  const createdPuil = (await knex('problemUserIsLearning')
    .insert({
      easiness: initialScore().easiness,
      consecutiveCorrectAnswers: initialScore().consecutiveCorrectAnswers,
      ifIgnored,
      nextDueDate: repetitions.nextDueDateOnLearn(learnedPuils, courseUserIsLearning.repeatEveryHours),
      // [claude comment] learning isn't reviewing
      lastReviewedAt: null,
      courseUserIsLearningId: courseUserIsLearning.id,
      problemId,
    })
    .returning('*')
  )[0];

  return createdPuil;
};

export default createPuil;
