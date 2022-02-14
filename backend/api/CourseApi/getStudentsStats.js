import knex from '~/db/knex';
import auth from '~/middlewares/auth';

const getStudentsStats = auth(async (request, response) => {

  const authorId = request.body['authorId'];
  const courseId = request.body['courseId'];
  const students = await knex('coauthor').select().where({ courseId });
  const totalAmountOfCards = await knex('problem').select().where({ courseId });
  const promises = []

  const authorStats = await knex('problem_user_is_learning')
    .select()
    .whereIn('course_user_is_learning_id', function() {
      this.select('id').from('course_user_is_learning').where({
        user_id: authorId,
        course_id: courseId
      })
  })

  promises.push(authorStats);

  students.forEach((student) => {
    
    const stats = knex('problem_user_is_learning')
      .select()
      .whereIn('course_user_is_learning_id', function() {
        this.select('id').from('course_user_is_learning').where({
          user_id: student.userId,
          course_id: courseId
        })
    })

    promises.push(stats)
  });

  const filteredProblems = await Promise.all(promises);

  const dto = []

  for (let index = 0; index < filteredProblems.length; index++) {
    const problems = filteredProblems[index];
    const latestReviewedFlashcard = problems.sort((a, b) => b.problemId - a.problemId)[0]

    dto.push({
      userId: index === 0 ? authorId : students[index - 1].userId,
      lastReviewedAt: latestReviewedFlashcard.lastReviewedAt,
      easinessMean: problems
        .reduce((a, b) => a + b.easiness, 0) / problems.length,
      learnedFlashcards: problems.length,
      totalFlashcards: totalAmountOfCards.length
    })
  }

  response.success(dto);
});

export default getStudentsStats;
