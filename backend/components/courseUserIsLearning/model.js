// course:
//    amount of mems
//    title
//   'view'   => /courses/:id/show

// /courses

// /profile/courses_learned_by_me
// they see a list of courses sorted by the amount of due problems.
// course with due problems has buttons:
//   'review'     => /courses/:id/review (it's 'solve' now)
//   'learn mode' => /courses/:id/show in the learn mode
//   amount of due mems

// /profile/courses_created_by_me
// course has buttons:
//   'edit'   => /courses/:id/edit


// /courses/:id/show
//   'delete' (if owner) => just deletes it
//   'edit'   (if owner) => /courses/:id/edit
//   'review'     (if learner) => /courses/:id/review
//   'learn mode' (if learner) => switch to learn mode
//   'add to learned courses'/'remove from learned courses'/'resume learning this course' button

// learned mode resumes from the last learnt mem

import { db } from '~/db/init.js';

import * as Problem from '~/components/problems/model';
import { getNextProblemScoreValue } from './services/getNextProblemScoreValue';
import { initialProblemScore } from './services/initialProblemScore';

// when user first /courses/1/solve the course, course_user_is_learning record is created.
const create = (courseId, userId) => {
  const initialProblemScores = Problem.indexByCourseId(courseId)
    .then((problems) => {
      problems.map((problem) => initialProblemScore(problem.id));
    });
  return db.none(
    "INSERT INTO course_user_is_learning (problem_scores, active, course_id, user_id) VALUES (${content}, ${explanation}, ${courseId}, ${created_at})",
    {
      problem_scores: initialProblemScores,
      active: true,
      course_id: courseId,
      user_id: userId
    }
  );
};

// solve particular problem
const updateProblemScore = async (courseUserIsLearningId, problemId, performanceRating) => {
  const problemScores = await findById(courseUserIsLearningId).problemScores;

  const problemScore = problemScores.find(score =>
    score.problemId === problemId
  );

  // problemScores got modified.
  problemScore.value = getNextProblemScoreValue(problemScore.value, performanceRating);

  return db.none(
    "UPDATE course_user_is_learning SET problem_scores = ${problemScores} WHERE id = ${id}",
    {
      problemScores,
      id: courseUserIsLearningId
    }
  );
};


const findById = (id) =>
  db.one(
    "SELECT * FROM course_user_is_learning WHERE id = ${id}",
    { id }
  );

const getDueProblems = async (id) => {
  const courseUserIsLearning = await findById(id);

  const idsOfDueProblems = courseUserIsLearning.problem_scores
    .filter(problemScore => problemScore.dueDate > new Date())
    .map(problemScore => problemScore.problemId);

  return Problem.indexByIds(idsOfDueProblems);
};

export { create, updateProblemScore, getDueProblems };
