import db from '#~/db/init.js';
import { camelizeDbColumns } from '#~/services/camelizeDbColumns.js';
import integerizeDbColumns from '#~/services/integerizeDbColumns.js';

const wherePublic = `
  course.if_public = true
    AND
  (
    SELECT COUNT(problem.id) FROM problem WHERE problem.course_id = course.id
  ) >= 2
`;

const sortByWord = (sortBy) => {
  switch (sortBy) {
    case 'popular': return `ORDER BY
      amount_of_course_ratings DESC,
      amount_of_users_learning_this_course DESC,
      amount_of_problems DESC
    `;
    case 'new': return `ORDER BY
      course.created_at DESC
    `;
    case 'random': return `ORDER BY
      random()
    `;
  }
};

const allCreated = (userId) =>
  db.any(
    `
    SELECT
      row_to_json(course.*) AS course,
      row_to_json("user".*) AS author,
      row_to_json(course_category.*) AS course_category,
      COUNT(distinct problem.id) AS amount_of_problems
    FROM course
    INNER JOIN problem
      ON problem.course_id = course.id
    INNER JOIN "user"
      ON "user".id = \${userId}
    INNER JOIN course_category
      ON course.course_category_id = course_category.id
    WHERE course.user_id = \${userId}
    GROUP BY (course.id, "user".id, course_category.id)
    `,
    { userId }
  );

// all public courses with 2 or more problems,
// sorted by amount of learners
// @sortBy = ['popular', 'new']
const allPublic = ({ sortBy, limit, offset, courseCategoryId, customWhere }) =>
  db.any(
    `
    SELECT
      row_to_json(course.*) AS course,
      row_to_json("user".*) AS author,
      row_to_json(course_category.*) AS course_category,
      COUNT(distinct course_user_is_learning.user_id) AS amount_of_users_learning_this_course,
      COUNT(distinct problem.id) AS amount_of_problems,
      ROUND(AVG(course_rating.rating), 1) AS average_course_rating,
      COUNT(distinct course_rating.id) AS amount_of_course_ratings,
      COUNT(*) OVER() AS n_of_all_courses
    FROM course
    LEFT OUTER JOIN course_user_is_learning
      ON (
        course_user_is_learning.active = true
        AND
        course.id = course_user_is_learning.course_id
      )
    LEFT OUTER JOIN course_rating
      ON course_rating.course_id = course.id
    INNER JOIN problem
      ON problem.course_id = course.id
    INNER JOIN "user"
      ON course.user_id = "user".id
    INNER JOIN course_category
      ON course.course_category_id = course_category.id
    WHERE
      ${wherePublic}
      ${customWhere ? customWhere : ''}
      ${courseCategoryId ? `AND course.course_category_id = ${courseCategoryId}` : ''}
    GROUP BY (course.id, "user".id, course_category.id)
    ${sortBy ? sortByWord(sortBy) : ''}
    ${limit ? `LIMIT ${limit}` : ''}
    ${offset ? `OFFSET ${offset}` : ''}
    `
  )
    .then((array) => camelizeDbColumns(array, ['course']))
    .then((array) => integerizeDbColumns(array, ['amountOfUsersLearningThisCourse', 'amountOfProblems', 'nOfAllCourses']));

export default {
  allCreated,
  allPublic
};
