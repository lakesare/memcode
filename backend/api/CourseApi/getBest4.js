import CourseModel from '#~/models/CourseModel.js'

const getBest4 = async (request, response) => {
  const welcomePageCourseIds = [
    31989, // Spanish
    31995, // French
    31988, // German
    31990, // Italian

    31993, // Japanese
    31992, // Russian
    31998, // Arabic
    32007, // Hebrew
  ];

  const courses = await CourseModel.allPublic({
    limit: 8,
    offset: 0,
    courseIds: welcomePageCourseIds
  });

  // Helper function to get courses in specified order
  const courseMap = new Map();
  courses.forEach((course) => { courseMap.set(course.course.id, course); });
  const coursesInOrder = welcomePageCourseIds
    .map(id => courseMap.get(id))
    .filter(course => course !== undefined);

  response.success({ courses: coursesInOrder });
};

export default getBest4;
