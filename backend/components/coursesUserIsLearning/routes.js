import express from 'express';
const router = express.Router();

import { catchAsync } from '~/services/catchAsync';
import { authenticateMiddleware } from '~/middlewares/authenticate';

import * as CourseUserIsLearning from './model';
import * as ProblemUserIsLearning from '~/components/problemsUserIsLearning/model';
import Notification from '~/components/notifications/model';
import Course from '~/components/courses/model';

router.post('/', authenticateMiddleware, catchAsync(async (request, response) => {
  const courseId = request.body['courseId'];
  const learner = request.currentUser;

  const courseUserIsLearning = await CourseUserIsLearning.insert.create({
    courseId: request.body['courseId'],
    userId: learner.id,
    active: true
  });

  const course = await Course.select.oneById(courseId);
  const authorId = course.userId;

  // console.log({ learnerId: learner.id, authorId });
  if (learner.id !== authorId) {
    // send author a notification that someone started learning their course!
    Notification.insert.create({
      type: 'someone_started_learning_your_course',
      content: {
        learnerId: learner.id,
        courseId: course.id,
        learnerUsername: learner.username,
        learnerAvatarUrl: learner.avatarUrl,
        courseTitle: course.title
      },
      userId: authorId
    });
  }

  response.status(200).json(courseUserIsLearning);
}));

router.put('/:id/resumeLearning', catchAsync(async (request, response) => {
  const courseUserIsLearning = await CourseUserIsLearning.update.ifActive(request.params['id'], true);
  // Notification.insert.create({
  //   type: 'someone_started_learning_your_course',
  //   content: `lakesare joined <a href="/courses/15/edit">Java Essentials</a>`,
  //   userId: 1
  // });
  response.status(200).json(courseUserIsLearning);
}));

router.put('/:id/stopLearning', catchAsync(async (request, response) => {
  const courseUserIsLearning = await CourseUserIsLearning.update.ifActive(request.params['id'], false);
  response.status(200).json(courseUserIsLearning);
}));

router.put('/:id/problems/:problemId/review', authenticateMiddleware, catchAsync(async (request, response) => {
  await ProblemUserIsLearning.update.review(
    request.params['id'],
    request.params['problemId'],
    request.body['performanceRating']
  );
  response.status(200).json({});
}));

router.post('/:id/problems/:problemId/learn', authenticateMiddleware, catchAsync(async (request, response) => {
  const puil = await ProblemUserIsLearning.insert.create({
    courseUserIsLearningId: request.params['id'],
    problemId: request.params['problemId']
  });
  response.status(200).json(puil);
}));

export { router };
