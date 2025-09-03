import knex from '#~/db/knex.js';
import auth from '#~/middlewares/auth.js';

const resumeLearningCourse = auth(async (request, response) => {
  const courseId = request.body['courseId'];
  const currentUser = request.currentUser;

  const courseUserIsLearning = (await knex('courseUserIsLearning')
    .where({ userId: currentUser.id, courseId })
    .update({ active: true })
    .returning('*')
  )[0];

  response.success(courseUserIsLearning);
});

export default resumeLearningCourse;
