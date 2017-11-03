import { db } from '~/db/init.js';
import { requireKeys } from '~/services/requireKeys';

const insert = {
  create: requireKeys(['active', 'courseId', 'userId'],
    (cuilFields) =>
      db.one(
        `INSERT INTO course_user_is_learning
        (active, course_id, user_id, started_learning_at) VALUES
        (\${active}, \${courseId}, \${userId}, timezone('UTC', now()))
        RETURNING *`,
        cuilFields
      )
  )
};

export { insert };
