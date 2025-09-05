import canAccessCourse from '#~/services/canAccessCourse.js';
import getProblemsByCourseId from '#~/api/services/getProblemsByCourseId.js';

const cantAccessError = "Sorry, this course is private. Only the author and coauthors and can access it.";

const getCoursePage = async (request, response) => {
  const courseId = request.body['courseId'];

  if (!(await canAccessCourse(courseId, request.currentUser))) {
    return response.error(cantAccessError);
  }

  const problems = await getProblemsByCourseId(courseId);

  response.success({ problems });
};

export default getCoursePage;
