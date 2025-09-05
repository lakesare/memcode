import CourseModel from '#~/models/CourseModel/index.js'

const getAllCreatedCourses = async (request, response) => {
  const courses = await CourseModel.select.allCreated(request.currentUser.id);
  response.success(courses);
};

export default getAllCreatedCourses;
