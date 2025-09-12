import knex from '#~/db/knex.js';
import { mustBeAuthorOrCoauthor } from '#~/services/auth.js';

const getStudentsStats = async (request, response) => {
  const authorId = request.body['authorId'];
  const courseId = request.body['courseId'];

  // Limit to 300 most recently active students to avoid performance issues
  const students = await knex('user')
    .select('user.*', 'course_user_is_learning.id as cuilId')
    .join('course_user_is_learning', { 'course_user_is_learning.user_id': 'user.id' })
    .join('problem_user_is_learning as pul', 'pul.course_user_is_learning_id', 'course_user_is_learning.id')
    .where({ 'course_user_is_learning.courseId': courseId, active: true })
    .groupBy('user.id', 'user.username', 'user.avatarUrl', 'course_user_is_learning.id')
    .orderBy(knex.raw('MAX(pul.last_reviewed_at)'), 'desc')
    .limit(300);

  const totalAmountOfCards = await knex('problem').select().where({ courseId });
  
  // Get total count of all students for metadata
  const totalStudentsResult = await knex('course_user_is_learning')
    .count('* as count')
    .where({ course_id: courseId, active: true })
    .first();
  const totalStudents = parseInt(totalStudentsResult.count);
  
  // Get all problems for these students in a single query instead of N+1 queries
  const cuilIds = students.map(s => s.cuilId);
  const allProblems = await knex('problem_user_is_learning')
    .select()
    .whereIn('course_user_is_learning_id', cuilIds);
  
  // Group problems by course_user_is_learning_id
  const problemsByCuil = {};
  allProblems.forEach(problem => {
    const cuilId = problem.courseUserIsLearningId;
    if (!problemsByCuil[cuilId]) problemsByCuil[cuilId] = [];
    problemsByCuil[cuilId].push(problem);
  });
  
  const filteredProblems = students.map(student => problemsByCuil[student.cuilId] || []);

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

  // Include metadata about remaining students for UI display
  const remainingStudents = Math.max(0, totalStudents - dto.length);

  response.success({
    students: dto,
    _remainingStudents: remainingStudents
  });
};

export default getStudentsStats;
