import CourseModel from '#~/models/CourseModel/index.js'

const searchCourses = async (request, response) => {
  const courses = await CourseModel.select.search(request.currentUser && request.currentUser.id, request.body.searchString);
  response.success(courses);
};

export default searchCourses;
