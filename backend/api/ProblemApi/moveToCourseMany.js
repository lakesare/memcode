import knex from '~/db/knex';
import movePuils from './services/movePuils';

const moveToCourseMany = async (request, response) => {
  const problemIds = request.body['problemIds'];
  const courseId = request.body['courseId'];

  // 1. Find the flashcards to insert
  const flashcards = await knex('problem').whereIn('id', problemIds)
    .map((flashcard) => ({
      type: flashcard.type,
      content: flashcard.content,
      courseId
    }));

  // 2. Insert the flashcards into the new course
  const insertedProblems = await knex('problem').insert(flashcards).returning('*');

  //2.1 Move the problems user is learning to new course as well (needs to be done before deletion to avoid constraint violation)
  await movePuils(problemIds, insertedProblems, courseId);

  // 3. Delete the flashcards from the original course
  await knex('problem').whereIn('id', problemIds).del();

  response.success();
};

export default moveToCourseMany;
