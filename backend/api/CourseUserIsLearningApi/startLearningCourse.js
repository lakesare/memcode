import knex from '~/db/knex';
import auth from '~/middlewares/auth';
import NotificationModel from '~/models/NotificationModel';

const startLearningCourse = auth(async (request, response) => {
  const courseId = request.body['courseId'];
  const currentUser = request.currentUser;

  const newCuil = (await knex('courseUserIsLearning')
    .insert({
      courseId,
      userId: currentUser.id,
      active: true
    })
    .returning('*')
  )[0];

  const course = (await knex('course').where({ id: courseId }))[0];
  const authorId = course.userId;

  if (currentUser.id !== authorId) {
    // send author a notification that someone started learning their course!
    await NotificationModel.insert.someone_started_learning_your_course({ learner: currentUser, course });
  }

  response.success(newCuil);
});

export default startLearningCourse;

