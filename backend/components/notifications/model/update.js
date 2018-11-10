import { db } from '~/db/init.js';

const markAsReadOrUnread = (id, ifRead) =>
  db.one(
    `
    UPDATE notification
    SET if_read = \${ifRead}
    WHERE id = \${id}
    RETURNING *
    `,
    { id, ifRead }
  );

const markAllNotificationsOfUserAsRead = (userId) =>
  db.any(
    `
    UPDATE notification
    SET if_read = true
    WHERE
      user_id = \${userId} AND
      if_read = false
    RETURNING *
    `,
    { userId }
  );

export default { markAsReadOrUnread, markAllNotificationsOfUserAsRead };
