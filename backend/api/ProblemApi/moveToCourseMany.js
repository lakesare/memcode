import knex from '~/db/knex';

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
  await knex('problem').insert(flashcards);

  // 3. Delete the flashcards from the original course
  await knex('problem').whereIn('id', problemIds).del();

  response.success();
};

export default moveToCourseMany;
