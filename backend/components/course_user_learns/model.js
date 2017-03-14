// http://www.blueraja.com/blog/477/a-better-spaced-repetition-learning-algorithm-sm2

// user goes to /courses, finds course.
// clicks on it, which leads them to the /courses/1 page,
// where they can see the contents of a course and click 'learn it' button if they liked the contents.
// that's when :course_user_learns gets created.

// then they click on 'solve'.

import { db } from '~/db/init.js';

import * as Problem from '~/components/problems/model';
import { getNextProblemScoreValue } from './services/getNextProblemScoreValue';
import { initialProblemScore } from './services/initialProblemScore';

// when user first /courses/1/solve the course, course_user_learns record is created.
const create = (courseId, userId) => {
  const initialProblemScores = Problem.indexByCourseId(courseId)
    .then((problems) => {
      problems.map((problem) => initialProblemScore(problem.id));
    });
  return db.none(
    "INSERT INTO course_user_learns (problemScores, active, course_id, user_id) VALUES (${content}, ${explanation}, ${courseId}, ${created_at})",
    {
      problemScores: initialProblemScores,
      active: true,
      course_id: courseId,
      user_id: userId
    }
  );
};

// solve particular problem
const solveProblem = async (courseUserLearnsId, problemId, performanceRating) => {
  const problemScores = await findById.then(courseUserLearns => courseUserLearns.problemScores);
  const problemScore = problemScores.find(score =>
    score.problemId === problemId
  );

  const nextProblemScoreValue = getNextProblemScoreValue(problemScore.value, performanceRating);

  // problemScores got modified.
  problemScore.value = nextProblemScoreValue;

  return db.none(
    "UPDATE course_user_learns SET problemScores = ${problemScores}",
    { problemScores }
  );
};


const findById = (id) =>
  db.one(
    "SELECT * FROM course_user_learns WHERE id = ${id}",
    { id }
  );


export { create, solveProblem };
