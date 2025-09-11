import knex from '#~/db/knex.js';
import movePuils from './services/movePuils.js';
import { mustOwnAllProblemsInSameCourse, mustBeAuthorOrCoauthor } from '#~/services/auth.js';

const moveToCourseMany = async (request, response) => {
  const problemIds = request.body['problemIds'];
  const courseId = request.body['courseId'];
  
  // Validate all problems belong to same source course and user has permission
  const sourceCourseId = await mustOwnAllProblemsInSameCourse(problemIds, request.currentUser);
  
  if (sourceCourseId === null) {
    return response.success(); // Empty array, nothing to do
  }
  
  // Check permission for destination course
  await mustBeAuthorOrCoauthor(courseId, request.currentUser);

  // Get the current maximum position for the destination course
  const maxPositionResult = await knex('problem')
    .where({ courseId: courseId })
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
    courseId: courseId,
    position: startingPosition + index
  }));

  // 3. Insert the flashcards into the new course
  const insertedProblems = await knex('problem').insert(flashcardsWithPositions).returning('*');

  // 4. Move the problems user is learning to new course as well (needs to be done before deletion to avoid constraint violation)
  await movePuils(problemIds, insertedProblems, courseId);

  // 5. Delete the flashcards from the original course
  await knex('problem').whereIn('id', problemIds).del();

  // 6. Resequence positions in the original course
  const remainingProblems = await knex('problem')
    .where({ courseId: sourceCourseId })
    .orderBy('position', 'asc')
    .select('id');
    
  const updatePromises = remainingProblems.map((problem, index) =>
    knex('problem').where({ id: problem.id }).update({ position: index + 1 })
  );
  
  await Promise.all(updatePromises);

  response.success();
};

export default moveToCourseMany;
