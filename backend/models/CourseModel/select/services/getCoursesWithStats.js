import db from '~/db/init.js';
import { integerizeDbColumns } from '~/services/integerizeDbColumns';
import { camelizeDbColumns } from '~/services/camelizeDbColumns';

// fetch course, courseUserAndLearning etc if it exists
//
// problemsToReview - later.
//   basically problem_user_is_learning with nextDueDate < Time.now
// problemsToLearn
//   all problems of this course MINUS learned problem_user_is_learning of this course
//
// => [{
//   course,
//   courseUserIsLearning,
//   amountOfProblemsToReview: 3,
//   amountOfProblemsToLearn: 2,
// }]
const getCoursesWithStats = ({ where = '', orderBy = '', params = {} } = {}) =>
  db.any(
    `SELECT
      row_to_json(course.*)                  AS course,
      row_to_json(course_user_is_learning.*) AS course_user_is_learning,
      row_to_json("user".*) AS author,
      row_to_json(course_category.*) AS course_category,
      COUNT(distinct problem_user_is_learning.id) AS amount_of_problems_to_review,
      (
        (SELECT COUNT(problem.*) FROM problem WHERE problem.course_id = course.id) -
        (SELECT COUNT(problem_user_is_learning.*) FROM problem_user_is_learning WHERE problem_user_is_learning.course_user_is_learning_id = course_user_is_learning.id)
      )                                      AS amount_of_problems_to_learn,
      COUNT(distinct problem.id)             AS amount_of_problems,
      (
        (
          SELECT MIN(problem_user_is_learning.next_due_date)
          FROM problem_user_is_learning
          WHERE
            (
              problem_user_is_learning.course_user_is_learning_id = course_user_is_learning.id
                AND
              problem_user_is_learning.if_ignored = false
            )
        )
          -
        timezone('UTC', now())
      )                                      AS next_due_date_in

    FROM course

    -- course_user_is_learning
    LEFT OUTER JOIN course_user_is_learning
      ON (
        course_user_is_learning.course_id = course.id
        AND
        course_user_is_learning.user_id = \${userId}
      )

    -- amount_of_problems_to_review
    LEFT OUTER JOIN problem_user_is_learning
      ON (
        course_user_is_learning.id = problem_user_is_learning.course_user_is_learning_id
        AND
        problem_user_is_learning.next_due_date < timezone('UTC', now())
        AND
        problem_user_is_learning.if_ignored = false
      )

    -- amount_of_problems
    LEFT OUTER JOIN problem ON problem.course_id = course.id


    INNER JOIN course_category
      ON course.course_category_id = course_category.id

    -- author
    INNER JOIN "user"
      ON course.user_id = "user".id

    ${where}

    GROUP BY course_user_is_learning.id, course.id, "user".id, course_category.id

    ${orderBy}
    `,
    params
  )
    .then((array) => camelizeDbColumns(array, ['course', 'courseUserIsLearning']))
    .then((array) => integerizeDbColumns(array, ['amountOfProblemsToReview', 'amountOfProblemsToLearn', 'amountOfProblems']));

export default getCoursesWithStats;
