import knex from '#~/db/knex.js';

const deleteCourse = async (request, response) => {
  const courseId = request.body.courseId;
  
  // Delete the course (cascade will handle related records)
  await knex('course')
    .where('id', courseId)
    .del();
    
  response.success({});
};

export default deleteCourse;
