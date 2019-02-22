import db from '~/db/init.js';

const oneOrNoneByUserAndCourse = ({ userId, courseId }) =>
  db.oneOrNone(
    'SELECT * FROM courseRatingByUser WHERE userId = ${id} AND courseId = ${courseId}',
    { userId, courseId }
  );

export default { oneOrNoneByUserAndCourse };
