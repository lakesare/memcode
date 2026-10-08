import knex from '#~/db/knex.js';
import { mustBeAuthenticated } from '#~/services/auth.js';

const createCourse = async (request, response) => {
  await mustBeAuthenticated(request.currentUser);

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
  const courseUserIsLearning = (await knex('courseUserIsLearning')
    .insert({ courseId: course.id, userId: currentUser.id, active: true })
    .returning('*'))[0];

  // [claude comment] a course created offline got a temporary learning record id, which this replaces
  response.success({ ...course, courseUserIsLearningId: courseUserIsLearning.id });
};

export default createCourse;
