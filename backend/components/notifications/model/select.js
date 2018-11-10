import { db } from '~/db/init.js';

const one = (id) =>
  db.one(
    'SELECT * FROM notification WHERE id = ${id}',
    { id }
  );

const mostRecentNotificationsOfUser = ({ userId, limit }) =>
  db.any(
    `
    SELECT *,
    (notification.created_at - timezone('UTC', now())) AS created_at_diff_from_now
    FROM notification
    WHERE
      notification.user_id = \${userId}
    ORDER BY notification.created_at DESC
    LIMIT \${limit}
    `,
    { userId, limit }
  );

export default {
  one, mostRecentNotificationsOfUser
};
