import { db } from '~/db/init.js';
import { requireKeys } from '~/services/requireKeys';

// Notification.insert.create({
//   type: 'someone_started_learning_your_course',
//   content: '',
//   userId
// })
const create = requireKeys(
  ['type', 'content', 'userId'],
  // { createdAt } is only used for the initial population of notifications currently,
  // maybe got to rename that column if we'll use it some other way
  ({ type, content, userId, createdAt = undefined }) =>
    db.one(
      `
        INSERT INTO notification (type, content, if_read, user_id, created_at)
        VALUES (\${type}, \${content}, false, \${userId}, ${createdAt ? "${createdAt}" : "timezone('UTC', now())"})
        RETURNING *
      `,
      {
        type,
        content,
        userId,
        createdAt
      }
    )
);

// => 3 (amount of notifications created/users notified)
const announceANewFeature = async (type, content) =>
  db.tx(async (transaction) => {
    const users = await db.many('SELECT * FROM "user"');
    const queries = users.map((user) =>
      transaction.one(
        `
          INSERT INTO notification (type, content, if_read, user_id)
          VALUES (\${type}, \${content}, false, \${userId})
          RETURNING *
        `,
        {
          type,
          content,
          userId: user.id
        }
      )
    );
    return transaction.batch(queries);
  })
    .then((notificationsCreated) => notificationsCreated.length);

export default {
  create, announceANewFeature
};
