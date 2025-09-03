import knex from '#~/db/knex.js';

const canAccessCourse = async (courseId, currentUser) => {
  const course = (await knex('course').where({ id: courseId }))[0];
  if (course.ifPublic) return true;
  if (!currentUser) return false;

  const isAuthor = course.userId === currentUser.id;
  if (isAuthor) return true;

  const isCoauthor = (await knex('coauthor').where({ courseId, userId: currentUser.id }))[0];
  if (isCoauthor) return true;
};

export default canAccessCourse;
