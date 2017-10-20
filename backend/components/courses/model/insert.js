import { db } from '~/db/init.js';

const insert = {
  create: (course) =>
    db.one(
      'INSERT INTO course (title, description, if_public, user_id) \
      VALUES (${title}, ${description}, ${ifPublic}, ${userId}) RETURNING *',
      {
        title: course.title,
        description: course.description,
        ifPublic: course.ifPublic,
        userId: course.userId
      }
    )
};

export { insert };
