import knex from '#~/db/knex.js';

const getSelectedCourses = async (request, response) => {
  // Hardcoded list of selected course IDs ordered by language popularity for learners
  const selectedCourseIds = [
    31989, // Spanish
    31995, // French
    31988, // German
    31990, // Italian
    31993, // Japanese
    31992, // Russian
    31994, // Chinese
    31996, // Korean
    32003, // Portuguese
    32002, // Dutch
    32004, // Hindi
    31998, // Arabic
    32007, // Hebrew
    32005, // Turkish
    32001, // Greek
    32006, // Ukrainian
    31991, // Finnish
    31997, // Latin
    31999, // Ancient Greek
    32000, // Esperanto
  ];

  try {
    // Build a simple query to get course details in the specified order
    const coursesData = await Promise.all(
      selectedCourseIds.map(async (courseId) => {
        const courseData = await knex
          .select(
            // Course details
            'course.id',
            'course.title', 
            'course.description',
            'course.created_at',
            // Author details
            'user.id as author_id',
            'user.username as author_username',
            // Category details  
            'course_category.id as category_id',
            'course_category.name as category_name'
          )
          .from('course')
          .innerJoin('user', 'course.user_id', '=', 'user.id')
          .innerJoin('course_category', 'course.course_category_id', '=', 'course_category.id')
          .where('course.id', courseId)
          .andWhere('course.if_public', true)
          .first();

        if (!courseData) {
          return null; // Skip if course doesn't exist or isn't public
        }

        // Get amount of problems
        const problemCount = await knex('problem')
          .where('course_id', courseId)
          .count('id as count')
          .first();

        // Format the response to match what CourseCardSimple expects
        return {
          course: {
            id: courseData.id,
            title: courseData.title,
            description: courseData.description,
            created_at: courseData.created_at
          },
          author: {
            id: courseData.author_id,
            username: courseData.author_username
          },
          courseCategory: {
            id: courseData.category_id,
            name: courseData.category_name
          },
          amountOfProblems: parseInt(problemCount.count)
        };
      })
    );

    // Filter out null entries (courses that don't exist or aren't public)
    const selectedCourses = coursesData.filter(course => course !== null);

    response.success({ selectedCourses });
  } catch (error) {
    console.error('Error fetching selected courses:', error);
    response.error('Failed to fetch selected courses');
  }
};

export default getSelectedCourses;