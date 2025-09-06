import knex from '#~/db/knex.js';
/**
 * Moves the all "problemUserIsLearning" (Puils) for the given problemIds to the given course Id
 * @param {*} problemIds the problemIds to move Puils for. 
 * @param {*} insertedProblems the inserted problems with their new IDs
 * @param {*} courseId the id of the course to move to
 */
const movePuils = async (problemIds, insertedProblems, courseId) => {
  //get the puils for the given problem ids
  const puils = await knex('problemUserIsLearning').whereIn('problem_id', problemIds);

  //map the inserted problems to the old problem's puils. 
  //  We need to do this, because not every problem necessarily has a puil.
  //  Directly connecting them via problem ID is not possible -> the newly inserted problems have a different id than in the old course.
  const mappedPuils = puils.map(puil => {
    return {
      puil: puil,
      insertedProblem: insertedProblems[problemIds.indexOf(puil.problemId)]
    };
  });

  //move each puil
  await Promise.all(mappedPuils.map(async (mappedPuil) => await movePuil(mappedPuil, courseId)));
};

const movePuil = async (mappedPuil, courseId) => {
  //get the id of the old course the user is learning
  const oldCuilId = mappedPuil.puil.courseUserIsLearningId;
  //find the old course the user is learning
  const oldCuil = (await knex('courseUserIsLearning').where({ id: oldCuilId }))[0];
  //use the user id and new course id to find the new course the user is learning
  const newCuil = (await knex('courseUserIsLearning').where({ courseId: courseId, userId: oldCuil.userId }))[0];

  if (newCuil) {
    //insert new puil, old one will be deleted due to cascade on delete of problem in old course it is linked to
    await knex('problemUserIsLearning')
      .insert({
        easiness: mappedPuil.puil.easiness,
        consecutiveCorrectAnswers: mappedPuil.puil.consecutiveCorrectAnswers,
        ifIgnored: mappedPuil.puil.ifIgnored,
        nextDueDate: mappedPuil.puil.nextDueDate,
        courseUserIsLearningId: newCuil.id,
        lastReviewedAt: mappedPuil.puil.lastReviewedAt,
        problemId: mappedPuil.insertedProblem.id,
      });
  }
}

export default movePuils;
