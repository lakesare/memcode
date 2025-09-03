import knex from '#~/db/knex.js';
import auth from '#~/middlewares/auth.js';
import canAccessCourse from '#~/services/canAccessCourse.js';

const duplicate = auth(async (request, response) => {
  const userId = request.currentUser.id;
  const courseId = request.body['courseId'];

  if (!(await canAccessCourse(courseId, request.currentUser))) {
    return response.error(`Sorry, you can't duplicate a private course.`);
  }

  const oldCourseSql = await knex('course').where({ id: courseId });
  const oldCourse = oldCourseSql[0];

  // 1. Duplicate course
  const newCourse = (await knex('course')
    .insert({
      title: oldCourse.title,
      description: oldCourse.description,
      ifPublic: true,
      duplicatedFromCourseId: oldCourse.id,
      userId,
      courseCategoryId: oldCourse.courseCategoryId
    })
    .returning('*')
  )[0];

  // 2. Duplicate problems
  const oldProblems = await knex('problem').where({ courseId });
  const newProblems = oldProblems.map((oldProblem) => ({
    type: oldProblem.type,
    position: oldProblem.position,
    content: oldProblem.content,
    courseId: newCourse.id
  }));
  await knex.batchInsert('problem', newProblems);

  // 3. Start learning yourself
  await knex('courseUserIsLearning').insert({
    courseId: newCourse.id,
    userId,
    active: true
  });

  return response.success({ courseId: newCourse.id });
});

export default duplicate;
