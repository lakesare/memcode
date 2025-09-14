import CourseModel from '#~/models/CourseModel.js';

const getSelectedCourses = async (request, response) => {
  // Regular languages (living, Latin alphabet) ordered by popularity
  const regularLanguageIds = [
    31989, // Spanish
    31995, // French
    31988, // German
    31990, // Italian
    32003, // Portuguese
    32002, // Dutch
    32008, // Swedish
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

  // All selected course IDs combined
  const allSelectedIds = [...regularLanguageIds, ...fancyAlphabetIds, ...funRareLanguageIds];
  
  // Fetch all courses at once using the existing optimized query
  const allCourses = await CourseModel.allPublic({
    limit: allSelectedIds.length,
    offset: 0,
    courseIds: allSelectedIds
  });

  // Create lookup map for fast access
  const courseMap = new Map();
  allCourses.forEach(course => {
    courseMap.set(course.course.id, course);
  });

  // Helper function to get courses in specified order
  const getCoursesInOrder = (courseIds) => {
    return courseIds
      .map(id => courseMap.get(id))
      .filter(course => course !== undefined);
  };

  try {
    // Get courses in the specified order for each section
    const regularLanguages = getCoursesInOrder(regularLanguageIds);
    const fancyAlphabetLanguages = getCoursesInOrder(fancyAlphabetIds);
    const funRareLanguages = getCoursesInOrder(funRareLanguageIds);

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