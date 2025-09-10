import knex from '#~/db/knex.js';
import movePuils from './services/movePuils.js';

const moveToCourseMany = async (request, response) => {
  const problemIds = request.body['problemIds'];
  const courseId = request.body['courseId'];

  // Get the current maximum position for the destination course
  const maxPositionResult = await knex('problem')
    .where({ course_id: courseId })
    .max('position as max_position')
    .first();
    
  const startingPosition = (maxPositionResult?.maxPosition || 0) + 1;

  // 1. Find the flashcards to insert
  const flashcards = await knex('problem').whereIn('id', problemIds)
    .orderBy('position', 'asc')
    .select('type', 'content');

  // 2. Add sequential positions and courseId to flashcards
  const flashcardsWithPositions = flashcards.map((flashcard, index) => ({
    type: flashcard.type,
    content: flashcard.content,
    course_id: courseId,
    position: startingPosition + index
  }));

  // 3. Insert the flashcards into the new course
  const insertedProblems = await knex('problem').insert(flashcardsWithPositions).returning('*');

  // 4. Move the problems user is learning to new course as well (needs to be done before deletion to avoid constraint violation)
  await movePuils(problemIds, insertedProblems, courseId);

  // 5. Get the original course_id to resequence positions after deletion
  const originalCourse = await knex('problem').whereIn('id', problemIds).first('course_id');
  const originalCourseId = originalCourse?.course_id;

  // 6. Delete the flashcards from the original course
  await knex('problem').whereIn('id', problemIds).del();

  // 7. Resequence positions in the original course
  if (originalCourseId) {
    const remainingProblems = await knex('problem')
      .where({ course_id: originalCourseId })
      .orderBy('position', 'asc')
      .select('id');
      
    const updatePromises = remainingProblems.map((problem, index) =>
      knex('problem')
        .where({ id: problem.id })
        .update({ position: index + 1 })
    );
    
    await Promise.all(updatePromises);
  }

  response.success();
};

export default moveToCourseMany;
