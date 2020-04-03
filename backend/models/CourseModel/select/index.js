import db from '~/db/init.js';
import { camelizeDbColumns } from '~/services/camelizeDbColumns';
import integerizeDbColumns from '~/services/integerizeDbColumns';
import wherePublic from './services/wherePublic';
import getCoursesWithStats from './services/getCoursesWithStats';

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

const select = {
  allCreated: (userId) =>
    getCoursesWithStats({
      where: `WHERE course.user_id = \${userId}`,
      params: { userId }
    }),

  // for /profile. returns all courses userId is currently learning.
  // only active,
  // filtered by amount of due problems (TODO)
  allLearned: (userId) =>
    getCoursesWithStats({
      where: ` WHERE course_user_is_learning.user_id = \${userId} AND course_user_is_learning.active = true`,
      orderBy: `
        ORDER BY
          amount_of_problems_to_review DESC,
          amount_of_problems_to_learn DESC,
          next_due_date_in ASC
      `,
      params: { userId }
    }),

  // all public courses with 2 or more problems,
  // sorted by amount of learners
  // @sortBy = ['popular', 'new']
  allPublic: ({ sortBy, limit, offset, courseCategoryId, customWhere }) =>
    db.any(
      `
      SELECT
        row_to_json(course.*) AS course,
        row_to_json("user".*) AS author,
        row_to_json(course_category.*) AS course_category,
        COUNT(distinct course_user_is_learning.user_id) AS amount_of_users_learning_this_course,
        COUNT(distinct problem.id) AS amount_of_problems,
        ROUND(AVG(course_rating.rating), 1) AS average_course_rating,
        COUNT(distinct course_rating.id) AS amount_of_course_ratings
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
      .then((array) => integerizeDbColumns(array, ['amountOfUsersLearningThisCourse', 'amountOfProblems'])),

  // countAllPublic: ({ courseCategoryId }) =>
  //   db.one(
  //     `
  //     SELECT
  //       COUNT(course.id) as amount_of_public_courses
  //     FROM course
  //     WHERE
  //       ${wherePublic}
  //       ${courseCategoryId ? `AND course.course_category_id = ${courseCategoryId}` : ''}
  //     `
  //   )
  //     .then((result) => result.amountOfPublicCourses),

  oneById: (id) =>
    db.one(
      `
      SELECT *
      FROM course
      WHERE course.id = \${id}
      `,
      { id }
    ),

  // 1. if I'm learning
  // 2. amount of flashcards
  // 3. author username
  // 4. amount of users learning this course
  // 5. category name!
  search: (userId, searchString) =>
    db.any(
      `
      SELECT
        row_to_json(course.*) AS course,
        COUNT(distinct course_user_is_learning.user_id) AS amount_of_users_learning_this_course,
        COUNT(distinct problem.id) AS amount_of_problems,
        "user".username AS author_username,
        course_category.name AS course_category_name,
        (
          SELECT
            COUNT(course_user_is_learning.id) = 1
          FROM
            course_user_is_learning
          WHERE
            course_user_is_learning.course_id = course.id
              AND
            course_user_is_learning.user_id = \${userId}
        ) AS if_user_is_learning
      FROM
        course
      INNER JOIN
        "user" ON
          course.user_id = "user".id
      INNER JOIN
        course_category ON
          course.course_category_id = course_category.id 
      LEFT OUTER JOIN
        course_user_is_learning ON (
          course.id = course_user_is_learning.course_id
          AND
          course_user_is_learning.active = true
        )
      LEFT OUTER JOIN
        problem ON
          course.id = problem.course_id
      WHERE
        (
          course.title ILIKE \${searchString} OR
          course.description ILIKE \${searchString}
        )
          AND
        ( -- either public or created by me
          course.user_id = \${userId} OR
          ${wherePublic}
        )
      GROUP BY
        course.id, "user".username, course_category.name
      ORDER BY
        -- if matches by description instead of by title - place last
        CASE
          WHEN course.title ILIKE \${searchString}
          THEN 1 ELSE 0
        END DESC,
        -- if user is learning - place first
        if_user_is_learning DESC,
        -- if user is an author - place first
        CASE
          WHEN course.user_id = \${userId}
          THEN 1 ELSE 0
        END DESC,
        -- if course is popular - place first
        amount_of_users_learning_this_course DESC
      `,
      { userId, searchString: `%${searchString}%` }
    ),
};

export default select;
