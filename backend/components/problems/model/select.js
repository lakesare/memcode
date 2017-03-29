import { db } from '~/db/init.js';

const select = {
  allByCourseId: (courseId) =>
    db.any(
      'SELECT * FROM problem WHERE course_id = ${courseId} ORDER BY created_at',
      { courseId }
    )
};

export { select };
