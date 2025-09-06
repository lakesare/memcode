import knex from '#~/db/knex.js';

const wherePublic = `
  course.if_public = true
    AND
  (
    SELECT COUNT(problem.id) FROM problem WHERE problem.course_id = course.id
  ) >= 2
`;

const searchCourses = async (request, response) => {
  const userId = request.currentUser && request.currentUser.id;
  const searchString = `%${request.body.searchString}%`;
  
  const courses = await knex.raw(`
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
          course_user_is_learning.user_id = ?
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
        course.title ILIKE ? OR
        course.description ILIKE ?
      )
        AND
      ( -- either public or created by me
        course.user_id = ? OR
        ${wherePublic}
      )
    GROUP BY
      course.id, "user".username, course_category.name
    ORDER BY
      -- if matches by description instead of by title - place last
      CASE
        WHEN course.title ILIKE ?
        THEN 1 ELSE 0
      END DESC,
      -- if user is learning - place first
      if_user_is_learning DESC,
      -- if user is an author - place first
      CASE
        WHEN course.user_id = ?
        THEN 1 ELSE 0
      END DESC,
      -- if course is popular - place first
      amount_of_users_learning_this_course DESC
  `, [userId, searchString, searchString, userId, searchString, userId]);
  
  response.success(courses.rows);
};

export default searchCourses;
