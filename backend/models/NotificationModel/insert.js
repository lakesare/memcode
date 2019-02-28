import db from '~/db/init.js';
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

export default {
  create
};
