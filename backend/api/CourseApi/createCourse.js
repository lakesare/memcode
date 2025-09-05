import knex from '#~/db/knex.js';

const createCourse = async (request, response) => {
  const currentUser = request.currentUser;
  const courseBody = request.body['course'];

  const course = (await knex('course').insert({
    title: courseBody.title,
    description: courseBody.description,
    if_public: courseBody.ifPublic,
    course_category_id: courseBody.courseCategoryId,
    user_id: currentUser.id
  })
    .returning('*'))[0];

  // Add to learned courses immediately
  await knex('courseUserIsLearning').insert({ courseId: course.id, userId: currentUser.id, active: true });

  response.success(course);
};

export default createCourse;
