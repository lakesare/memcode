import { db } from '~/db/init.js';

const select = {
  one: (id) =>
    db.one(
      'SELECT * FROM problem WHERE id = ${id}',
      { id }
    ),
  allByCourseId: (courseId) =>
    db.any(
      'SELECT * FROM problem WHERE course_id = ${courseId} ORDER BY position, created_at',
      { courseId }
    ),
  all: () =>
    db.any('SELECT * FROM problem')
};

export { select };
