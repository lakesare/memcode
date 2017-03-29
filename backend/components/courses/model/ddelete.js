import { db } from '~/db/init.js';

const ddelete = {
  // will delete all problems of this course and all course_user_is_learning
  destroyCourseWithProblems: (courseId) =>
    db.none('DELETE FROM course WHERE id=${courseId}', { courseId })
};

export { ddelete };
