import CourseModel from '#~/models/CourseModel.js'

const getPublicCourses = async (request, response) => {
  const pageSize = request.body.pageSize;
  const pageNumber = request.body.pageNumber;

  const onePageOfCourses = await CourseModel.allPublic({
    sortBy: request.body.sortBy,
    limit: pageSize,
    offset: (pageNumber - 1) * pageSize,
    courseCategoryId: request.body.courseCategoryId,
    customWhere: `AND course.title ILIKE '%${request.body.searchString}%'`
  });

  const nOfAllCourses = onePageOfCourses[0] ? onePageOfCourses[0].nOfAllCourses : 0;

  response.success({
    onePageOfCourses,
    amountOfPages: Math.ceil(nOfAllCourses / pageSize)
  });
};

export default getPublicCourses;
