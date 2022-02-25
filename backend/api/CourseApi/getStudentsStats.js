import knex from '~/db/knex';
import auth from '~/middlewares/auth';

const getStudentsStats = auth(async (request, response) => {

  const authorId = request.body['authorId'];
  const courseId = request.body['courseId'];

  const students = await knex('user')
    .select('user.*')
    .join('course_user_is_learning', { 'course_user_is_learning.user_id': 'user.id' })
    .where({ 'course_user_is_learning.courseId': courseId, active: true });

  const totalAmountOfCards = await knex('problem').select().where({ courseId });
  const promises = []

  students.forEach((student) => {
    
    const stats = knex('problem_user_is_learning')
      .select()
      .whereIn('course_user_is_learning_id', function() {
        this.select('id').from('course_user_is_learning').where({
          user_id: student.id,
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
      id: students[index].id,
      username: students[index].username,
      avatarUrl: students[index].avatarUrl,
      lastReviewedAt: 
        latestReviewedFlashcard !== undefined && 
        latestReviewedFlashcard.lastReviewedAt !== null ? latestReviewedFlashcard.lastReviewedAt : undefined,
      easinessMean: problems.length > 0 ? problems
        .reduce((a, b) => a + b.easiness, 0) / problems.length : 0,
      learnedFlashcards: problems.length,
      totalFlashcards: totalAmountOfCards.length
    })
  }

  response.success(dto);
});

export default getStudentsStats;
