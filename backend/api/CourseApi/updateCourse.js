import knex from '#~/db/knex.js';

const updateCourse = async (request, response) => {
  const courseId = request.body.courseId;
  const courseData = request.body.course;
  
  const [updatedCourse] = await knex('course')
    .where('id', courseId)
    .update({
      title: courseData.title,
      description: courseData.description,
      if_public: courseData.ifPublic,
      course_category_id: courseData.courseCategoryId || null,
      updated_at: knex.fn.now()
    })
    .returning('*');
    
  response.success(updatedCourse);
};

export default updateCourse;
