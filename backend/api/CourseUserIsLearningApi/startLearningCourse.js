import knex from '#~/db/knex.js';
import auth from '#~/middlewares/auth.js';
import NotificationModel from '#~/models/NotificationModel.js';

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
    // Send author a notification that someone started learning their course
    await NotificationModel.create({
      type: 'someone_started_learning_your_course',
      content: { learnerId: currentUser.id, courseId: course.id, learnerUsername: currentUser.username, learnerAvatarUrl: currentUser.avatarUrl, courseTitle: course.title },
      userId: course.userId
    });
  }

  response.success(newCuil);
});

export default startLearningCourse;

