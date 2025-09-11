// Import all CourseApi methods
import getPublicCourses from './getPublicCourses.js';
import getAllCreatedCourses from './getAllCreatedCourses.js';
import searchCourses from './searchCourses.js';
import createCourse from './createCourse.js';
import updateCourse from './updateCourse.js';
import deleteCourse from './deleteCourse.js';

// Keep existing dynamic methods
import rate from './rate.js';
import getStudentsStats from './getStudentsStats.js';
import getRatings from './getRatings.js';
import getMyEverything from './getMyEverything.js';
import getBest4 from './getBest4.js';
import duplicate from './duplicate.js';
import updateCoauthors from './updateCoauthors.js';

export default {
  getPublicCourses,
  getAllCreatedCourses,
  searchCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  rate,
  getStudentsStats,
  getRatings,
  getMyEverything,
  getBest4,
  duplicate,
  updateCoauthors,
};
