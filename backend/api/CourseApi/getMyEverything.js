import db from '#~/db/init.js';
import { mustBeAuthenticated } from '#~/services/auth.js';

// TODO - we should get rif of ~/db/init.js, this file is the only remaining use of that api
const getMyEverything = async (request, response) => {
  await mustBeAuthenticated(request.currentUser);
  const userId = request.currentUser.id;

  // COALESCE(json_agg(problem.id) FILTER (WHERE problem.id IS NOT NULL), '[]')
  const courses = await db.any(
    `SELECT
      row_to_json(course.*)          AS course,
      row_to_json("user".*)          AS author,
      row_to_json(course_category.*) AS course_category
    FROM course

    INNER JOIN course_user_is_learning
      ON (
        course_user_is_learning.course_id = course.id
        AND
        course_user_is_learning.user_id = \${userId}
        AND
        course_user_is_learning.active = true
      )

    INNER JOIN course_category
      ON course.course_category_id = course_category.id

    -- author
    INNER JOIN "user"
      ON course.user_id = "user".id

    GROUP BY course_user_is_learning.id, course.id, "user".id, course_category.id`,
    { userId }
  );

  const myLearnedProblems = await db.any(
    `
      SELECT
        problem_user_is_learning.*,
        course_user_is_learning.course_id AS course_id
      FROM problem_user_is_learning
      INNER JOIN course_user_is_learning
        ON course_user_is_learning.id = problem_user_is_learning.course_user_is_learning_id
      WHERE
          course_user_is_learning.user_id = \${userId}
        AND
          course_user_is_learning.active = true
    `,
    { userId }
  );

  const allProblemsIMayLearn = await db.any(
    `
      SELECT
        problem.id AS problem_id,
        course_user_is_learning.course_id AS course_id
      FROM problem
      INNER JOIN course_user_is_learning
        ON course_user_is_learning.course_id = problem.course_id
      WHERE
          course_user_is_learning.user_id = \${userId}
        AND
          course_user_is_learning.active = true
    `,
    { userId }
  );


  const allProblemsNotLearned = allProblemsIMayLearn.filter((problem) =>
    !myLearnedProblems.find((learnedProblem) => learnedProblem.problemId === problem.problemId)
  );
  // 357ms without js
  // 500ms with js

  const dto = courses.map((course) => {
    const courseId = course.course.id;
    const problems = [
      ...myLearnedProblems
        .filter((myLearnedProblem) => {
          return myLearnedProblem.courseId === courseId;
        })
        .map((myLearnedProblem) => ({
          id: myLearnedProblem.problemId,
          _learned: true,
          courseId: myLearnedProblem.courseId,
          nextDueDate: myLearnedProblem.nextDueDate,
          ifIgnored: myLearnedProblem.ifIgnored,
          easiness: myLearnedProblem.easiness,
          consecutiveCorrectAnswers: myLearnedProblem.consecutiveCorrectAnswers
        })),
      ...allProblemsNotLearned
        .filter((myNotLearnedProblem) => {
          return myNotLearnedProblem.courseId === courseId;
        })
        .map((myLearnedProblem) => ({
          id: myLearnedProblem.problemId,
          // Problems I didn't click either 'learn' or 'ignore' for
          _learned: false
        }))
    ];

    return { ...course, problems };
  });

  response.success(dto);
};

export default getMyEverything;
