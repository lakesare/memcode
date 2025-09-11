import knex from '#~/db/knex.js';
import { mustBeAuthorOrCoauthor } from '#~/services/auth.js';

const updateCourse = async (request, response) => {
  const courseId = request.body.courseId;
  const courseData = request.body.course;
  
  // Authors and coauthors can update courses
  await mustBeAuthorOrCoauthor(courseId, request.currentUser);
  
  // Update the course
  const [updatedCourse] = await knex('course')
    .where({ id: courseId })
    .update({
      title: courseData.title,
      description: courseData.description,
      if_public: courseData.ifPublic,
      course_category_id: courseData.courseCategoryId
    })
    .returning('*');
    
  response.success(updatedCourse);
};
export default updateCourse;
