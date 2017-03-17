import { db } from '~/db/init.js';

import * as Problem from '~/components/problems/model';
import * as CourseUserIsLearning from '~/components/coursesUserIsLearning/model';

const indexByIds = (ids) => {
  if (ids.length === 0) return [];
  const stringOfIds = ids.join(', '); // '1, 3, 17'
  // return db.any(
  //   `SELECT * FROM course WHERE id IN (${stringOfIds})`
  // );
  return db.any(`\
    SELECT course.*, COUNT(*) AS "amount_of_problems"\
    FROM course\
      LEFT OUTER JOIN problem ON problem.course_id=course.id\
    WHERE course.id IN (${stringOfIds})
    GROUP BY course.id\
  `);
};

const findById = (id) =>
  db.one('SELECT * FROM course WHERE id = ${id}', { id });

// course: {title: "aaa", userOauthId, userOauthProvider}
// => { courseId: 5 }
const create = (course) =>
  db.one('INSERT INTO course (title, user_id) VALUES (${title}, ${userId}) RETURNING id', course)
  .then(createdCourse => createdCourse.id);

const getCourses = () =>
  db.any('\
    SELECT course.*, COUNT(*) AS "amount_of_problems"\
    FROM course\
      LEFT OUTER JOIN problem ON problem.course_id=course.id\
    GROUP BY course.id;\
  ');

const update = course =>
  db.any('UPDATE course SET title = ${title} WHERE id = ${id}', {
    title: course.title, id: course.id
  });

const getCourseWithProblems = (userId, courseId) =>
  Promise.all([
    db.one('SELECT * FROM course WHERE id = ${courseId}', { courseId }),
    Problem.indexByCourseId(courseId),
    CourseUserIsLearning.findByUserIdAndCourseId(userId, courseId)
  ])
    .then((values) => ({
      course: values[0],
      problems: values[1],
      courseUserIsLearning: values[2]
    }));

// will delete all problems of this course and all course_user_is_learning
const destroyCourseWithProblems = (courseId) =>
  db.none('DELETE FROM course WHERE id=${courseId}', { courseId });

export { indexByIds, findById, create, getCourseWithProblems, destroyCourseWithProblems, update, getCourses };
