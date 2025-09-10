import knex from '#~/db/knex.js';
import auth from '#~/middlewares/auth.js';

const create = auth(async (request, response) => {
  const problem = request.body['problem'];

  // Get the current maximum position for this course and assign next position
  const maxPositionResult = await knex('problem')
    .where({ course_id: problem.courseId })
    .max('position as max_position')
    .first();
  
  const nextPosition = (maxPositionResult?.maxPosition || 0) + 1;
  
  const problemWithPosition = {
    ...problem,
    position: nextPosition
  };

  const createdProblem = (await knex('problem').insert(problemWithPosition).returning('*'))[0];

  response.success(createdProblem);
});

export default create;
