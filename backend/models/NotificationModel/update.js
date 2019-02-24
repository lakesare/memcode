import db from '~/db/init.js';

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

export default { markAsReadOrUnread };
