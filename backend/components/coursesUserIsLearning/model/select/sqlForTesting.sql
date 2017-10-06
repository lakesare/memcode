SELECT
  course.title AS course_title,
  COALESCE(json_agg(problem_user_is_learning.problem_id) FILTER (WHERE problem_user_is_learning.problem_id IS NOT NULL), '[]') AS ids_of_problems_to_review

FROM course_user_is_learning

INNER JOIN course
  ON course_user_is_learning.course_id = course.id

-- [...course, ...course_user_is_learning]
LEFT JOIN problem_user_is_learning
  ON (
    problem_user_is_learning.course_user_is_learning_id = course_user_is_learning.id
    AND
    problem_user_is_learning.next_due_date < timezone('UTC', now())
  )

WHERE
    course_user_is_learning.user_id = 1
  AND
    course_user_is_learning.active = true
GROUP BY course.id


[
  ...course, ...course_user_is_learning, ...problem_user_is_learning
]

SELECT
  course.title AS course_title,
  json_agg(DISTINCT problem.id) AS ids_of_problems_to_learn

FROM course_user_is_learning

INNER JOIN course
  ON course_user_is_learning.course_id = course.id

LEFT JOIN problem
  ON problem.course_id = course.id

WHERE
    course_user_is_learning.user_id = 1
  AND
    course_user_is_learning.active = true
  AND
    -- problems in this course
    problem.id
    NOT IN
    -- minus problems user is already learning
    (
      SELECT problem_user_is_learning.problem_id
      FROM problem_user_is_learning
      WHERE problem_user_is_learning.course_user_is_learning_id = course_user_is_learning.id
    )
GROUP BY course.id

