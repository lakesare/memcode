import { commonFetch } from './commonFetch';
import hashToQueryString from './services/hashToQueryString';

// params = { userId, limit }
const getMostRecentNotificationsOfUser = (dispatch, params = {}) =>
  commonFetch(dispatch,
    'GET', `/api/notifications/most-recent-notifications-of-user?${hashToQueryString(params)}`
  );

const getNotificationsStatsForUser = (dispatch, params = {}) =>
  commonFetch(dispatch,
    'GET', `/api/notifications/stats-for-user?${hashToQueryString(params)}`
  );

const markAsReadOrUnread = (dispatch, id, values) =>
  commonFetch(dispatch,
    'PUT', `/api/notifications/${id}/mark-as-read-or-unread`,
    values
  );

const markAllNotificationsAsRead = (dispatch, values) =>
  commonFetch(dispatch,
    'PUT', `/api/notifications/markAllNotificationsAsRead`,
    values
  );

export default {
  getMostRecentNotificationsOfUser,
  getNotificationsStatsForUser,
  markAsReadOrUnread,
  markAllNotificationsAsRead
};
