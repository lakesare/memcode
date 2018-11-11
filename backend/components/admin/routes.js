import express from 'express';
const router = express.Router();

import { db } from '~/db/init.js';

import { catchAsync } from '~/services/catchAsync';
import Notification from '~/components/notifications/model';

// we need an admin page to be creating notifications for new functionality

// router.get('/most-recent-notifications-of-user', catchAsync(async (request, response) => {
//   const userId = request.query.userId;
//   const limit = request.query.limit;
//   const notifications = await Notification.select.mostRecentNotificationsOfUser({ userId, limit });

//   response.status(200).json(notifications);
// }));

const createComeoneStartedYourCourseNotificationPromise = async (cuil) => {
  const course = await db.one('SELECT * FROM course WHERE course.id = ${courseId}', { courseId: cuil.courseId });
  const learner = await db.one('SELECT * from "user" WHERE "user".id = ${userId}', { userId: cuil.userId });
  const learnerId = cuil.userId;
  const authorId = course.userId;
  if (learnerId !== authorId) {
    const notification = await Notification.insert.create({
      type: 'someone_started_learning_your_course',
      content: {
        learnerId: learner.id,
        courseId: course.id,
        learnerUsername: learner.username,
        learnerAvatarUrl: learner.avatarUrl,
        courseTitle: course.title
      },
      userId: authorId,
      createdAt: cuil.startedLearningAt
    });
    return notification;
  }
  // just any promise, could be undefined just fine
  return true;
};

// we need a button to create notifications for every existing user:
router.post('/temporary/create-notifications-for-existing-users', catchAsync(async (request, response, next) => {
  const all_cuils = await db.many('SELECT * FROM course_user_is_learning');

  const promises = [];
  all_cuils.forEach((cuil) => promises.push(createComeoneStartedYourCourseNotificationPromise(cuil)));
  Promise.all(promises)
    .then(() => response.status(200).json({ message: `Success, ${all_cuils.length} rows affected.` }))
    .catch((error) => next(error));
}));

export default router;
