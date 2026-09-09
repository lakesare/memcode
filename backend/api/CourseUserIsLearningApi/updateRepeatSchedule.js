import knex from '#~/db/knex.js';
import { mustOwnCuil } from '#~/services/auth.js';
import repetitions from '../../../services/repetitions.js';

// [claude comment] switching between spaced repetition and a fixed interval unlearns every flashcard of this course, while changing only the hours keeps progress - the schedule didn't actually change kind
const updateRepeatSchedule = async (request, response) => {
  const courseUserIsLearningId = request.body['id'];

  await mustOwnCuil(courseUserIsLearningId, request.currentUser);

  const cuil = await knex('courseUserIsLearning').where({ id: courseUserIsLearningId }).first();
  const repeatEveryHours = repetitions.parseRepeatEveryHours(request.body['repeatEveryHours']);

  const ifScheduleChanged = Boolean(cuil.repeatEveryHours) !== Boolean(repeatEveryHours);

  if (ifScheduleChanged) {
    await knex('problemUserIsLearning').where({ courseUserIsLearningId: cuil.id }).del();
  }

  const [updatedCuil] = await knex('courseUserIsLearning')
    .where({ id: cuil.id })
    .update({ repeatEveryHours })
    .returning('*');

  response.success({ courseUserIsLearning: updatedCuil, ifProgressWasReset: ifScheduleChanged });
};

export default updateRepeatSchedule;
