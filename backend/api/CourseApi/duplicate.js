import knex from '~/db/knex';
import auth from '~/middlewares/auth';

// course, but with a different .created and .authorId
// and all problems
const duplicate = auth(async (request, response) => {
  const userId = request.currentUser.id;
  const courseId = request.body['courseId'];

  const oldCourseSql = await knex('course').where({ id: courseId });
  const oldCourse = oldCourseSql[0];

  // 1. Duplicate course
  const newCourse = (await knex('course')
    .insert({
      title: oldCourse.title,
      description: oldCourse.description,
      ifPublic: true,
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

  response.success({ courseId: newCourse.id });
});

export default duplicate;
