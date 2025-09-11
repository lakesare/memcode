import knex from '#~/db/knex.js';
import { mustBeAuthor } from '#~/services/auth.js';

const deleteCourse = async (request, response) => {
  const courseId = request.body.courseId;
  
  // Only course authors can delete courses
  await mustBeAuthor(courseId, request.currentUser);
  
  // Delete the course (cascade will handle related records)
  await knex('course')
    .where('id', courseId)
    .del();
    
  response.success({});
};

export default deleteCourse;
