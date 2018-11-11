import express from 'express';
const router = express.Router();

import { catchAsync } from '~/services/catchAsync';
import Notification from './model';

// sorted by most recent!
// params = { userId, limit, offset }
router.get('/most-recent-notifications-of-user', catchAsync(async (request, response) => {
  const userId = request.query.userId;
  const limit = request.query.limit;
  const offset = request.query.offset;
  const notifications = await Notification.select.mostRecentNotificationsOfUser({ userId, limit, offset });

  response.status(200).json(notifications);
}));

// params = { userId }
router.get('/stats-for-user', catchAsync(async (request, response) => {
  const userId = request.query.userId;
  const amountOfUnreadNotifications = await Notification.select.amountOfUnreadNotificationsForUser({ userId });
  const amountOfAllNotifications = await Notification.select.amountOfAllNotificationsForUser({ userId });

  response.status(200).json({
    amountOfUnreadNotifications,
    amountOfAllNotifications
  });
}));

router.put('/:id/mark-as-read-or-unread', catchAsync(async (request, response) => {
  const updatedNotification = await Notification.update.markAsReadOrUnread(request.params['id'], request.body['ifRead']);
  response.status(200).json(updatedNotification);
}));

router.put('/mark-all-notifications-as-read', catchAsync(async (request, response) => {
  await Notification.update.markAllNotificationsOfUserAsRead(request.body['userId']);
  response.status(200).json({});
}));

export default router;
