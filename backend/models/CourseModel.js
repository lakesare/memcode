import knex from '#~/db/knex.js';

const allCreated = (userId) =>
  knex
    .select(
      knex.raw('row_to_json(course.*) AS course'),
      knex.raw('row_to_json("user".*) AS author'),
      knex.raw('row_to_json(course_category.*) AS course_category'),
      knex.raw('COUNT(distinct problem.id) AS amount_of_problems')
    )
    .from('course')
    .innerJoin('problem', 'problem.course_id', 'course.id')
    .innerJoin('user', 'user.id', 'course.user_id')
    .innerJoin('course_category', 'course.course_category_id', 'course_category.id')
    .where('course.user_id', userId)
    .groupBy('course.id', 'user.id', 'course_category.id');

// all public courses with 2 or more problems,
// sorted by amount of learners
// @sortBy = ['popular', 'new']
const allPublic = async ({ sortBy, limit, offset, courseCategoryId, searchString, userId, courseIds }) => {
  // Build base query for filtering
  const baseQuery = knex('course')
    .innerJoin('problem', 'problem.course_id', 'course.id')
    .innerJoin('course_category', 'course.course_category_id', 'course_category.id')
    .where('course.if_public', true);
  
  if (courseCategoryId) {
    baseQuery.where('course.course_category_id', courseCategoryId);
  }
  
  if (searchString && searchString.trim() !== '') {
    baseQuery.where('course.title', 'ilike', `%${searchString.trim()}%`);
  }
  
  if (userId) {
    baseQuery.where('course.user_id', userId);
  }
  
  if (courseIds && courseIds.length > 0) {
    baseQuery.whereIn('course.id', courseIds);
  }
  
  // Get total count with a separate, optimized query
  const countResult = await knex
    .count('* as total_count')
    .from(
      baseQuery
        .clone()
        .select('course.id')
        .groupBy('course.id')
        .havingRaw('COUNT(distinct problem.id) >= 2')
        .as('filtered_courses')
    )
    .first();
  
  // Build main query
  let mainQuery = knex
    .select(
      knex.raw('row_to_json(course.*) AS course'),
      knex.raw('row_to_json("user".*) AS author'),
      knex.raw('row_to_json(course_category.*) AS course_category'),
      knex.raw('COUNT(distinct course_user_is_learning.user_id) AS amount_of_users_learning_this_course'),
      knex.raw('COUNT(distinct problem.id) AS amount_of_problems')
    )
    .from('course')
    .leftJoin('course_user_is_learning', function() {
      this.on('course_user_is_learning.course_id', 'course.id')
          .andOn('course_user_is_learning.active', knex.raw('true'));
    })
    .innerJoin('problem', 'problem.course_id', 'course.id')
    .innerJoin('user', 'course.user_id', 'user.id')
    .innerJoin('course_category', 'course.course_category_id', 'course_category.id')
    .where('course.if_public', true);
  
  // Add filters
  if (courseCategoryId) {
    mainQuery = mainQuery.where('course.course_category_id', courseCategoryId);
  }
  
  if (searchString && searchString.trim() !== '') {
    mainQuery = mainQuery.where('course.title', 'ilike', `%${searchString.trim()}%`);
  }
  
  if (userId) {
    mainQuery = mainQuery.where('course.user_id', userId);
  }
  
  if (courseIds && courseIds.length > 0) {
    mainQuery = mainQuery.whereIn('course.id', courseIds);
  }
  
  // Add grouping and having
  mainQuery = mainQuery
    .groupBy('course.id', 'user.id', 'course_category.id')
    .havingRaw('COUNT(distinct problem.id) >= 2');
  
  // Add sorting
  if (sortBy === 'popular') {
    mainQuery = mainQuery
      .orderBy('amount_of_users_learning_this_course', 'desc')
      .orderBy('amount_of_problems', 'desc');
  } else if (sortBy === 'new') {
    mainQuery = mainQuery.orderBy('course.created_at', 'desc');
  } else if (sortBy === 'random') {
    mainQuery = mainQuery.orderByRaw('random()');
  }
  
  // Add pagination
  if (limit) {
    mainQuery = mainQuery.limit(limit);
  }
  if (offset) {
    mainQuery = mainQuery.offset(offset);
  }
  
  const courses = await mainQuery;
  
  // Add the count to each course record and convert strings to integers
  const coursesWithCount = courses.map(course => ({
    ...course,
    amountOfUsersLearningThisCourse: parseInt(course.amountOfUsersLearningThisCourse),
    amountOfProblems: parseInt(course.amountOfProblems),
    nOfAllCourses: parseInt(countResult.totalCount)
  }));
  
  return coursesWithCount;
};

export default {
  allCreated,
  allPublic
};
