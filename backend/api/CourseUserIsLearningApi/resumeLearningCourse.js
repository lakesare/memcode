import knex from '#~/db/knex.js';
import { mustBeAuthenticated } from '#~/services/auth.js';

const resumeLearningCourse = async (request, response) => {
  await mustBeAuthenticated(request.currentUser);
  const courseId = request.body['courseId'];
  const currentUser = request.currentUser;

  const courseUserIsLearning = (await knex('courseUserIsLearning')
    .where({ userId: currentUser.id, courseId })
    .update({ active: true })
    .returning('*')
  )[0];

  response.success(courseUserIsLearning);
};

export default resumeLearningCourse;
