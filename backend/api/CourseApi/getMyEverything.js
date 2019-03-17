import knex from '~/db/knex';
import auth from '~/middlewares/auth';

// => [[problemId, courseUserisLearningId]]
const getWhereInDataStructure = (problems, coursesUserIsLearning) =>
  problems.map((problem) => {
    const courseUserIsLearning = coursesUserIsLearning.find((cuil) => cuil.courseId === problem.courseId);
    return [problem.id, courseUserIsLearning.id];
  });

const getMyEverything = auth(async (request, response) => {
  const userId = request.currentUser.id;

  const coursesUserIsLearning = await knex('courseUserIsLearning')
    .where({ userId });

  const courses = await knex('course')
    .whereIn('id', coursesUserIsLearning.map((cuil) => cuil.courseId));

  // const problems = await knex('problem')
  //   .whereIn('courseId', coursesUserIsLearning.map((cuil) => cuil.courseId));

  // // now we need to exclude all problems learned by other users
  // const problemsUserIsLearning = await knex('problemUserIsLearning')
  //   .whereIn(['problemId', 'courseUserIsLearningId'], getWhereInDataStructure(problems, coursesUserIsLearning));

  // console.log({ userId, coursesUserIsLearning, courses, problems, problemsUserIsLearning });

  response.success({
    coursesUserIsLearning,
    courses,
    // problems,
    // problemsUserIsLearning
  });
});

export default getMyEverything;
