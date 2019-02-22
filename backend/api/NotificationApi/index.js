import express from 'express';
const router = express.Router();

import catchAsync from '~/services/catchAsync';
import NotificationModel from '~/models/NotificationModel';

// sorted by most recent!
// params = { userId, limit, offset }
router.get('/most-recent-notifications-of-user', catchAsync(async (request, response) => {
  const userId = request.query.userId;
  const limit = request.query.limit;
  const offset = request.query.offset;
  const notifications = await NotificationModel.select.mostRecentNotificationsOfUser({ userId, limit, offset });

  response.status(200).json(notifications);
}));

// params = { userId }
router.get('/stats-for-user', catchAsync(async (request, response) => {
  const userId = request.query.userId;
  const amountOfUnreadNotifications = await NotificationModel.select.amountOfUnreadNotificationsForUser({ userId });
  const amountOfAllNotifications = await NotificationModel.select.amountOfAllNotificationsForUser({ userId });

  response.status(200).json({
    amountOfUnreadNotifications,
    amountOfAllNotifications
  });
}));

router.put('/:id/mark-as-read-or-unread', catchAsync(async (request, response) => {
  const updatedNotification = await NotificationModel.update.markAsReadOrUnread(request.params['id'], request.body['ifRead']);
  response.status(200).json(updatedNotification);
}));

router.put('/mark-all-notifications-as-read', catchAsync(async (request, response) => {
  await NotificationModel.update.markAllNotificationsOfUserAsRead(request.body['userId']);
  response.status(200).json({});
}));

router.post('/announce-a-new-feature', catchAsync(async (request, response) => {
  const amountOfUsersNotified = await NotificationModel.insert.announceANewFeature(request.body['type'], request.body['content']);
  response.status(200).json({ message: `${amountOfUsersNotified} users are notified!` });
}));

export default router;
