import { db } from '~/db/init.js';
import { camelizeDbColumns } from '~/services/camelizeDbColumns';

import { fetchCoursesAndTheirStats } from '~/model/select';

const select = {
  allCreated: (userId) =>
    fetchCoursesAndTheirStats(`WHERE course.user_id = \${userId}`, userId),

  // for /profile. returns all courses userId is currently learning.
  // only active,
  // filtered by amount of due problems (TODO)
  allLearned: (userId) =>
    fetchCoursesAndTheirStats(`WHERE course_user_is_learning.user_id = \${userId} AND course_user_is_learning.active = true`, userId),

  all: () =>
    db.any(
      `SELECT
        row_to_json(course.*) AS course,
        COUNT(problem.id)     AS amount_of_problems
      FROM course
      LEFT OUTER JOIN problem ON problem.course_id = course.id
      WHERE if_public = true
      GROUP BY course.id
      `,
    )
      .then(array => camelizeDbColumns(array, ['course', 'courseUserIsLearning'])),

  oneForActions: (id, userId) =>
    fetchCoursesAndTheirStats(`WHERE course.id = ${id}`, userId)
      .then((array) => array[0]),

  oneById: (id) =>
    db.one(
      `
      SELECT *
      FROM course
      WHERE course.id = \${id}
      `,
      { id }
    )
};

export { select };
