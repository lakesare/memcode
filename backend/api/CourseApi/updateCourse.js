import CourseModel from '#~/models/CourseModel/index.js'

const updateCourse = async (request, response) => {
  const courseId = request.body.courseId;
  const updatedCourse = await CourseModel.update.update(courseId, request.body['course']);
  response.success(updatedCourse);
};

export default updateCourse;
