import CourseModel from '#~/models/CourseModel.js'

const getPublic = async (request, response) => {
  const pageSize = request.body['pageSize'];
  const pageNumber = request.body['pageNumber'];

  // Conversion effort -  Raw SQL to Knex like syntax
  // Can be used later when support for some functions like count, camelize column names are available from knex

  // let query = knex().select(knex.raw('row_to_json(course.*) AS course, row_to_json("user".*) AS author, row_to_json(course_category.*) AS course_category, COUNT(distinct course_user_is_learning.user_id) AS amount_of_users_learning_this_course, ROUND(AVG(course_rating.rating),1) AS average_course_rating, COUNT(distinct problem.id) AS amount_of_problems, COUNT(distinct course_rating.id) AS amount_of_course_ratings'))
  // .from('course')
  // .innerJoin('problem', 'problem.course_id', '=', 'course.id')
  // .innerJoin('user', 'course.user_id', '=', 'user.id')
  // .innerJoin('course_category', 'course.course_category_id', '=', 'course_category.id')
  // .leftOuterJoin('course_rating', 'course_rating.course_id', 'course.id')
  // .leftOuterJoin(knex.raw('course_user_is_learning ON (course_user_is_learning.active = true AND course.id = course_user_is_learning.course_id)'))
  // .where('course.if_public', 'true')
  // .andWhere(2, "<=", subquery)
  // .groupByRaw('course.id, "user".id, course_category.id')
  // .orderByRaw(sortByQuery) // This function to be copied from model
  // pageSize ? query.limit(pageSize) : '';
  // pageNumber && pageSize ? query.offset((pageNumber - 1) * pageSize) : '';

  // const OnePageOfCourses = await query;

  const onePageOfCourses = await CourseModel.allPublic({
    sortBy: request.query.sortBy,
    limit: pageSize,
    offset: (pageNumber - 1) * pageSize,
    courseCategoryId: request.query.courseCategoryId,
    customWhere: `AND course.title ILIKE '%${request.query.searchString}%'`
  });

  const nOfAllCourses = onePageOfCourses[0] ? onePageOfCourses[0].nOfAllCourses : 0;

  response.status(200).json({
    onePageOfCourses,
    amountOfPages: Math.ceil(nOfAllCourses / pageSize)
  });
};

export default getPublic;
