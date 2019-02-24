import db from '~/db/init.js';

const oneOrNoneByUserAndCourse = ({ userId, courseId }) =>
  db.oneOrNone(
    'SELECT * FROM course_rating WHERE user_id = ${userId} AND course_id = ${courseId}',
    { userId, courseId }
  );

const anyByCourse = ({ courseId }) =>
  db.any(
    'SELECT * FROM course_rating WHERE course_id = ${courseId}',
    { courseId }
  );

export default { oneOrNoneByUserAndCourse, anyByCourse };
