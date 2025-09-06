import knex from '#~/db/knex.js';
import auth from '#~/middlewares/auth.js';

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
    // Create the notification
    await knex('notification').insert({ 
      type: 'someone_started_learning_your_course',
      content: {
        learnerId: currentUser.id,
        courseId: course.id,
        learnerUsername: currentUser.username,
        learnerAvatarUrl: currentUser.avatarUrl,
        courseTitle: course.title
      },
      userId: course.userId,
      ifRead: false
    });
    
    // Mark that the user has unseen notifications
    await knex('user')
      .where({ id: course.userId })
      .update({ did_see_notifications: false });
  }

  response.success(newCuil);
});

export default startLearningCourse;

