import knex from '#~/db/knex.js';

const getProblemsByCourseId = (courseId) =>
  knex('problem').where({ course_id: courseId })
    .orderBy('position');

export default {
  getProblemsByCourseId
};
