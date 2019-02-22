import db from '~/db/init.js';

const one = (id) =>
  db.one(
    'SELECT * FROM notification WHERE id = ${id}',
    { id }
  );

const mostRecentNotificationsOfUser = ({ userId, limit, offset = 0 }) =>
  db.any(
    `
    SELECT
      *,
      (notification.created_at - timezone('UTC', now())) AS created_at_diff_from_now
    FROM
      notification
    WHERE
      notification.user_id = \${userId}
    ORDER BY
      notification.created_at DESC
    OFFSET
      \${offset}
    LIMIT
      \${limit}
    `,
    { userId, limit, offset }
  );

// => 5
const amountOfUnreadNotificationsForUser = ({ userId }) =>
  db.one(
    `SELECT COUNT(*) AS amount FROM notification WHERE user_id = \${userId} AND if_read=false`,
    { userId }
  ).then(({ amount }) => parseInt(amount));

const amountOfAllNotificationsForUser = ({ userId }) =>
  db.one(
    `SELECT COUNT(*) AS amount FROM notification WHERE user_id = \${userId}`,
    { userId }
  ).then(({ amount }) => parseInt(amount));

export default {
  one, mostRecentNotificationsOfUser,
  amountOfUnreadNotificationsForUser, amountOfAllNotificationsForUser
};
