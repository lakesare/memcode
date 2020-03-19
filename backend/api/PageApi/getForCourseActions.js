import knex from '~/db/knex';
import CourseModel from '~/models/CourseModel';

const getForCourseActions = async (request, response) => {
  const courseId = request.body['courseId'];
  const currentUser = request.currentUser;

  const course = await CourseModel.select.oneForActions(courseId, currentUser ? currentUser.id : null);
  if (!course) throw new Error("Sorry, course with this id has not yet been created.");
  const courseStats = await CourseModel.select.getCourseStats(courseId);

  // It's fine to expose emails of already-added users
  const coauthors = await knex('user')
    .select('user.*')
    .join('coauthor', { 'coauthor.userId': 'user.id' })
    .where({ 'coauthor.courseId': courseId })
    .orderBy('coauthor.createdAt', 'asc');

  response.success({ ...course, stats: courseStats, coauthors });
};

export default getForCourseActions;
