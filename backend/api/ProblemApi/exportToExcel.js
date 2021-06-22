import knex from '~/db/knex';

const getProblemsByCourseId = (courseId) =>
  knex('problem').where({ course_id: courseId })
    // Put position-0 last (because it means they were created after the latest reordering!) (https://stackoverflow.com/a/3130216/3192470)
    .orderByRaw('position=0')
    .orderBy('position')
    .orderBy('createdAt', 'asc');

const exportToExcel = async (request, response) => {
  const courseId = request.body['courseId'];

  const problems = await getProblemsByCourseId(courseId);

  response.success(problems);
};

export default exportToExcel;
