import knex from '#~/db/knex.js';

const getSelectedCourses = async (request, response) => {
  // Regular languages (living, Latin alphabet) ordered by popularity
  const regularLanguageIds = [
    31989, // Spanish
    31995, // French
    31988, // German
    31990, // Italian
    32003, // Portuguese
    32002, // Dutch
    31991, // Finnish
  ];

  // Fancy alphabet languages (living, non-Latin scripts) ordered by popularity
  const fancyAlphabetIds = [
    31993, // Japanese
    31992, // Russian
    31994, // Chinese
    31996, // Korean
    31998, // Arabic
    32007, // Hebrew
    32001, // Greek
    32006, // Ukrainian
    32004, // Hindi
    32005, // Turkish
  ];

  // Fun/rare languages (dead, constructed, or very specialized)
  const funRareLanguageIds = [
    31997, // Latin
    31999, // Ancient Greek
    32000, // Esperanto
  ];

  const fetchCoursesForIds = async (courseIds) => {
    const coursesData = await Promise.all(
      courseIds.map(async (courseId) => {
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

    return coursesData.filter(course => course !== null);
  };

  try {
    // Fetch all three sections
    const regularLanguages = await fetchCoursesForIds(regularLanguageIds);
    const fancyAlphabetLanguages = await fetchCoursesForIds(fancyAlphabetIds);
    const funRareLanguages = await fetchCoursesForIds(funRareLanguageIds);

    response.success({ 
      regularLanguages,
      fancyAlphabetLanguages,
      funRareLanguages 
    });
  } catch (error) {
    console.error('Error fetching selected courses:', error);
    response.error('Failed to fetch selected courses');
  }
};

export default getSelectedCourses;