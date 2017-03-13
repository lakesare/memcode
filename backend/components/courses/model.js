import { db } from '~/db/init.js';

// course: {title: "aaa", userOauthId, userOauthProvider}
// => { courseId: 5 }
const create = (course) =>
  db.one('INSERT INTO course (title, user_oauth_id, user_oauth_provider) VALUES (${title}, ${userOauthId}, ${userOauthProvider}) RETURNING id', course)
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

const getCourseWithProblems = (courseId) =>
  Promise.all([
    db.one('SELECT * FROM course WHERE id = ${courseId}', { courseId }),
    db.any('select * from problem where course_id = ${courseId} ORDER BY created_at', { courseId })
  ])
    .then((values) => ({
      course: values[0], problems: values[1]
    }));

const deleteCourseWithProblems = (courseId) => (
  db.tx(transaction => (
    transaction.batch([
      transaction.none('DELETE FROM problem WHERE course_id=${courseId}', { courseId }),
      transaction.none('DELETE FROM course WHERE id=${courseId}', { courseId }),
    ])
  ))
    .then(() => ({ data: true }))
    .catch(error => Promise.reject({ error }))
);

export { create, getCourseWithProblems, deleteCourseWithProblems, update, getCourses };
