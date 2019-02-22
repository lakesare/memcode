import db from '~/db/init.js';

// will delete all problems of this course and all course_user_is_learning
const destroyCourseWithProblems = (courseId) =>
  db.none('DELETE FROM course WHERE id=${courseId}', { courseId });

export default { destroyCourseWithProblems };
