import CourseModel from '#~/models/CourseModel.js'

const getAllCreatedCourses = async (request, response) => {
  const courses = await CourseModel.allCreated(request.currentUser.id);
  response.success(courses);
};

export default getAllCreatedCourses;
