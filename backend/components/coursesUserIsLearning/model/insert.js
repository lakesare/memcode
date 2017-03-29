import { db } from '~/db/init.js';

const insert = {
  create: async (courseId, userId) =>
    db.one(
      "INSERT INTO course_user_is_learning \
      (active, course_id, user_id) VALUES \
      (true, ${courseId}, ${userId}) \
      RETURNING *",
      { courseId, userId }
    )
};

export { insert };
