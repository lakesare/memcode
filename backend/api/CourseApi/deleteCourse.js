import CourseModel from '#~/models/CourseModel/index.js'

const deleteCourse = async (request, response) => {
  const courseId = request.body.courseId;
  await CourseModel.delete.destroyCourseWithProblems(courseId);
  response.success({});
};

export default deleteCourse;
