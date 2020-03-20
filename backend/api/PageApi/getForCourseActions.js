import knex from '~/db/knex';
import CourseModel from '~/models/CourseModel';

const getForCourseActions = async (request, response) => {
  const courseId = request.body['courseId'];
  const currentUserId = request.currentUser ? request.currentUser.id : null;

  const course = await CourseModel.select.oneForActions(courseId, currentUserId);
  if (!course) throw new Error("Sorry, this course doesn't exist.");

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
