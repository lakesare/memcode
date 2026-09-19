import knex from '#~/db/knex.js';
import { mustBeAuthenticated } from '#~/services/auth.js';

// [claude comment] row_to_json() keeps snake_case inside each nested object, and knex-stringcase only camelizes the top-level result keys - so course/author/courseCategory reach the frontend snake_cased, while repeatEveryHours next to them is camelCase
const getMyEverything = async (request, response) => {
  await mustBeAuthenticated(request.currentUser);
  const userId = request.currentUser.id;

  const courses = await knex('course')
    .select(
      knex.raw('row_to_json(course.*) AS course'),
      knex.raw('row_to_json("user".*) AS author'),
      knex.raw('row_to_json(course_category.*) AS course_category'),
      'courseUserIsLearning.repeatEveryHours'
    )
    .innerJoin('courseUserIsLearning', 'courseUserIsLearning.courseId', 'course.id')
    .innerJoin('courseCategory', 'courseCategory.id', 'course.courseCategoryId')
    .innerJoin('user', 'user.id', 'course.userId')
    .where({
      'courseUserIsLearning.userId': userId,
      'courseUserIsLearning.active': true
    })
    .orderBy('course.id');

  const myLearnedProblems = await knex('problemUserIsLearning')
    .select('problemUserIsLearning.*', 'courseUserIsLearning.courseId')
    .innerJoin('courseUserIsLearning', 'courseUserIsLearning.id', 'problemUserIsLearning.courseUserIsLearningId')
    .where({
      'courseUserIsLearning.userId': userId,
      'courseUserIsLearning.active': true
    });

  const allProblemsIMayLearn = await knex('problem')
    .select('problem.id as problemId', 'courseUserIsLearning.courseId')
    .innerJoin('courseUserIsLearning', 'courseUserIsLearning.courseId', 'problem.courseId')
    .where({
      'courseUserIsLearning.userId': userId,
      'courseUserIsLearning.active': true
    });

  const allProblemsNotLearned = allProblemsIMayLearn.filter((problem) =>
    !myLearnedProblems.find((learnedProblem) => learnedProblem.problemId === problem.problemId)
  );

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
          lastReviewedAt: myLearnedProblem.lastReviewedAt,
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
