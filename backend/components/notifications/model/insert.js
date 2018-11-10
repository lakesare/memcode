import { db } from '~/db/init.js';
import { requireKeys } from '~/services/requireKeys';

// Notification.insert.create({
//   type: 'someone_started_learning_your_course',
//   content: '',
//   userId
// })
const create = requireKeys(
  ['type', 'content', 'userId'],
  ({ type, content, userId }) =>
    db.one(
      "INSERT INTO notification (type, content, if_read, user_id) VALUES (${type}, ${content}, false, ${userId}) RETURNING *",
      {
        type,
        content,
        userId
      }
    )
);

export default {
  create
};
