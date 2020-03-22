import knex from '~/db/knex';

const getForCourseActions = async (request, response) => {
  const courseId = request.body['courseId'];
  const currentUser = request.currentUser;
  const course = (await knex('course').where({ id: courseId }))[0];
  if (!course) throw new Error("Sorry, this course doesn't exist.");

  const author = (await knex('user').where({ id: course.userId }))[0];
  const courseCategory = (await knex('courseCategory').where({ id: course.courseCategoryId }))[0];
  const amountOfProblems = Number.parseInt((await knex('problem').count('id as amount').where({ courseId: course.id }))[0].amount);

  const learners = await knex('user')
    .select('user.*')
    .join('courseUserIsLearning', { 'courseUserIsLearning.userId': 'user.id' })
    .where({ 'courseUserIsLearning.courseId': courseId, active: true });

  // It's fine to expose emails of already-added users
  const coauthors = await knex('user')
    .select('user.*')
    .join('coauthor', { 'coauthor.userId': 'user.id' })
    .where({ 'coauthor.courseId': courseId })
    .orderBy('coauthor.createdAt', 'asc');

  const courseUserIsLearning = currentUser ?
    (await knex('courseUserIsLearning').where({ userId: currentUser.id, courseId }))[0] :
    null;

  response.success({
    course,
    author,
    courseUserIsLearning,
    courseCategory,
    amountOfProblems,
    coauthors,
    learners,
  });
};

export default getForCourseActions;
