import knex from '#~/db/knex.js';

// Helper to throw consistent authorization errors
const throwAuthError = (message = 'Authentication required') => {
  const error = new Error(message);
  error.status = 401;
  throw error;
};

const throwForbiddenError = (message = 'Access denied') => {
  const error = new Error(message);
  error.status = 403;
  throw error;
};

// Basic authentication check
export const mustBeAuthenticated = async (currentUser) => {
  if (!currentUser) {
    throwAuthError();
  }
};

// Learning record authorization - user can only access their own learning records
export const mustOwnCuil = async (cuilId, currentUser) => {
  await mustBeAuthenticated(currentUser);
  
  const cuil = await knex('courseUserIsLearning').where({ id: cuilId }).first();
  if (!cuil) {
    throwForbiddenError('Learning record not found');
  }
  
  if (cuil.userId !== currentUser.id) {
    throwForbiddenError('You can only access your own learning records');
  }
  
  // Just do authorization, don't return anything
};

export const mustOwnPuil = async (puilId, currentUser) => {
  await mustBeAuthenticated(currentUser);
  
  const puil = await knex('problemUserIsLearning').where({ id: puilId }).first();
  if (!puil) {
    throwForbiddenError('Learning record not found');
  }
  
  const cuil = await knex('courseUserIsLearning').where({ id: puil.courseUserIsLearningId }).first();
  if (cuil.userId !== currentUser.id) {
    throwForbiddenError('You can only access your own learning records');
  }
  
  // Just do authorization, don't return anything
};

// Course-related authorization
export const mustBeAuthor = async (courseId, currentUser) => {
  await mustBeAuthenticated(currentUser);
  
  const course = await knex('course').where({ id: courseId }).first();
  if (!course) {
    throwForbiddenError('Course not found');
  }
  
  if (course.userId !== currentUser.id) {
    throwForbiddenError('You must be the course author to perform this action');
  }
  
  return course;
};

export const mustBeAuthorOrCoauthor = async (courseId, currentUser) => {
  await mustBeAuthenticated(currentUser);
  
  const course = await knex('course').where({ id: courseId }).first();
  if (!course) {
    throwForbiddenError('Course not found');
  }
  
  // Check if user is the author
  if (course.userId === currentUser.id) {
    return course;
  }
  
  // Check if user is a coauthor
  const coauthor = await knex('coauthor')
    .where({ courseId, userId: currentUser.id })
    .first();
    
  if (!coauthor) {
    throwForbiddenError('You must be the course author or coauthor to perform this action');
  }
  
  return course;
};

// Course read access authorization
export const mustBeAbleToReadCourse = async (courseId, currentUser) => {
  const course = await knex('course').where({ id: courseId }).first();
  if (!course) {
    throwForbiddenError('Course not found');
  }
  
  // Public courses can be read by anyone
  if (course.ifPublic) {
    return;
  }
  
  // Private courses require authentication
  await mustBeAuthenticated(currentUser);

  // Authors can read their own courses
  if (course.userId === currentUser.id) {
    return;
  }

  // Coauthors can read courses they collaborate on
  const coauthor = await knex('coauthor')
    .where({ courseId, userId: currentUser.id })
    .first();
  if (coauthor) {
    return;
  }
  
  throwForbiddenError('You do not have permission to access this course');
};

// Bulk problem operations validation
export const mustOwnAllProblemsInSameCourse = async (problemIds, currentUser) => {
  if (!problemIds || problemIds.length === 0) {
    return null; // No problems to validate
  }

  // Get all problems to validate they exist and belong to the same course
  const problems = await knex('problem').whereIn('id', problemIds).select('id', 'courseId');
  
  if (problems.length !== problemIds.length) {
    const error = new Error('Some problems do not exist');
    error.status = 400;
    throw error;
  }

  // Check that all problems belong to the same course
  const courseIds = [...new Set(problems.map(p => p.courseId))];
  if (courseIds.length > 1) {
    const error = new Error('All problems must belong to the same course');
    error.status = 400;
    throw error;
  }

  // Check permission for the course
  await mustBeAuthorOrCoauthor(courseIds[0], currentUser);
  
  return courseIds[0]; // Return the courseId for use in the calling function
};

// Admin-level authorization
export const mustBeAdmin = async (currentUser) => {
  await mustBeAuthenticated(currentUser);

  const adminUsers = [1];
  if (!adminUsers.includes(currentUser.id)) {
    throwForbiddenError('Admin access required');
  }
};
