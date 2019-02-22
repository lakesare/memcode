import express from 'express';
const router = express.Router();

import catchAsync from '~/services/catchAsync';
import authenticateMiddleware from '~/middlewares/authenticate';

import CourseUserIsLearningModel from '~/models/CourseUserIsLearningModel';
import ProblemUserIsLearningModel from '~/models/ProblemUserIsLearningModel';
import NotificationModel from '~/models/NotificationModel';
import CourseModel from '~/models/CourseModel';

// import * from '~/models';

router.post('/', authenticateMiddleware, catchAsync(async (request, response) => {
  const courseId = request.body['courseId'];
  const learner = request.currentUser;

  const courseUserIsLearning = await CourseUserIsLearningModel.insert.create({
    courseId,
    userId: learner.id,
    active: true
  });

  const course = await CourseModel.select.oneById(courseId);
  const authorId = course.userId;

  // console.log({ learnerId: learner.id, authorId });
  if (learner.id !== authorId) {
    // send author a notification that someone started learning their course!
    NotificationModel.insert.create({
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
  const courseUserIsLearning = await CourseUserIsLearningModel.update.ifActive(request.params['id'], true);
  // Notification.insert.create({
  //   type: 'someone_started_learning_your_course',
  //   content: `lakesare joined <a href="/courses/15/edit">Java Essentials</a>`,
  //   userId: 1
  // });
  response.status(200).json(courseUserIsLearning);
}));

router.put('/:id/stopLearning', catchAsync(async (request, response) => {
  const courseUserIsLearning = await CourseUserIsLearningModel.update.ifActive(request.params['id'], false);
  response.status(200).json(courseUserIsLearning);
}));

router.put('/:id/problems/:problemId/review', authenticateMiddleware, catchAsync(async (request, response) => {
  await ProblemUserIsLearningModel.update.review(
    request.params['id'],
    request.params['problemId'],
    request.body['performanceRating']
  );
  response.status(200).json({});
}));

router.post('/:id/problems/:problemId/learn', authenticateMiddleware, catchAsync(async (request, response) => {
  const puil = await ProblemUserIsLearningModel.insert.create({
    courseUserIsLearningId: request.params['id'],
    problemId: request.params['problemId']
  });
  response.status(200).json(puil);
}));

export default router;
