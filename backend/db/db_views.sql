-- For comfortable viewing

-- 1. To see the code of the view
select pg_get_viewdef('timeline_of_joined_courses', true)





-- timeline_of_joined_courses VIEW
CREATE OR REPLACE VIEW "timeline_of_joined_courses" AS
SELECT "user".username,
to_char("user".created_at, 'YYYY DD Month, HH24:MI'::text) AS user_created_at,
course.title,
course.if_public,
course.id,
to_char(timezone('+03:00'::text, course_user_is_learning.started_learning_at), 'DD Month, HH24:MI'::text) AS started_learning_at

FROM ((course_user_is_learning
JOIN "user" ON (("user".id = course_user_is_learning.user_id)))
JOIN course ON ((course.id = course_user_is_learning.course_id)))
ORDER BY course_user_is_learning.started_learning_at DESC;









-- timeline_of_reviewed_flashcards

CREATE OR REPLACE VIEW "timeline_of_reviewed_flashcards" AS
SELECT "user".username,
   to_char(timezone('+03:00'::text, "user".created_at), 'YYYY DD Month, HH24:MI'::text) AS user_created_at,
   course.title AS course_title,
   course.id AS course_id,
   course.if_public,
   problem.content,
   to_char(timezone('+03:00'::text, problem_user_is_learning.last_reviewed_at), 'DD Month, HH24:MI'::text) AS last_reviewed_at
  FROM problem_user_is_learning
    JOIN course_user_is_learning ON course_user_is_learning.id = problem_user_is_learning.course_user_is_learning_id
    JOIN "user" ON "user".id = course_user_is_learning.user_id
    JOIN course ON course.id = course_user_is_learning.course_id
    JOIN problem ON problem.id = problem_user_is_learning.problem_id
--  WHERE "user".username::text <> 'lakesare'::text
 ORDER BY problem_user_is_learning.last_reviewed_at DESC;




