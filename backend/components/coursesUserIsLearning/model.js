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
import * as Course from '~/components/courses/model';
import { getNextProblemScoreValue } from './services/getNextProblemScoreValue';
import { initialProblemScore } from './services/initialProblemScore';


const isProblemDue = (problemScore) =>
  new Date(problemScore.value.nextDueDate) < new Date();

// => [{
//   ...usual course object,
//   courseUserIsLearningId: 10,
//   amountOfDueProblems: 3
// }], active, filtered by amount of due problems
const coursesWithDueProblems = async (userId) => {
  const allCoursesUserLearns = await db.any(
    "SELECT id, course_id, problem_scores from course_user_is_learning WHERE user_id = ${userId} and active = true",
    { userId }
  );

  const amountAndIds = allCoursesUserLearns.map((courseUserIsLearning) => {
    const dueProblems = courseUserIsLearning.problemScores
      .filter(problemScore => isProblemDue(problemScore));
    return ({
      courseId: courseUserIsLearning.courseId,
      amountOfDueProblems: dueProblems.length,
      courseUserIsLearningId: courseUserIsLearning.id
    });
  });

  const sortedAmountAndIds = amountAndIds.sort((a, b) => a.amountOfDueProblems - b.amountOfDueProblems);

  const courseIds = sortedAmountAndIds.map((amountAndId) => amountAndId.courseId);
  const courses = await Course.indexByIds(courseIds);

  const modifiedCourses = sortedAmountAndIds.map((amountAndId) => {
    const course = courses.find(c => c.id === amountAndId.courseId);
    return ({
      ...course,
      amountOfDueProblems: amountAndId.amountOfDueProblems,
      courseUserIsLearningId: amountAndId.courseUserIsLearningId
    });
  });

  return modifiedCourses;
};

const create = async (courseId, userId) => {
  const initialProblemScores = await Problem.indexByCourseId(courseId)
    .then((problems) =>
      problems.map((problem) => initialProblemScore(problem.id))
    );
  return db.none(
    "INSERT INTO course_user_is_learning \
    (problem_scores, active, course_id, user_id) VALUES \
    (${problemScores}, ${active}, ${courseId}, ${userId})",
    {
      problemScores: JSON.stringify(initialProblemScores),
      active: true,
      courseId,
      userId
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

// => {
//   course: { title: 'wow' },
//   problems: dueProblems
// }
const getDueProblems = async (id) => {
  const courseUserIsLearning = await findById(id);

  const idsOfDueProblems = courseUserIsLearning.problemScores
    .filter(problemScore => isProblemDue(problemScore))
    .map(problemScore => problemScore.problemId);

  return {
    course: await Course.findById(courseUserIsLearning.courseId),
    problems: await Problem.indexByIds(idsOfDueProblems)
  };
};

export { coursesWithDueProblems, create, updateProblemScore, getDueProblems };
