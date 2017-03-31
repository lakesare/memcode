import { db } from '~/db/init.js';

const insert = {
  create: (course, userId) =>
    db.one(
      'INSERT INTO course (title, user_id) \
      VALUES (${title}, ${userId}) RETURNING *',
      {
        title: course.title,
        userId
      }
    )
};

export { insert };
