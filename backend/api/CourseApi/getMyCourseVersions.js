import knex from '#~/db/knex.js';
import { mustBeAuthenticated } from '#~/services/auth.js';

// [claude comment] the offline copy compares these with the versions it downloaded, and downloads again only the courses whose version changed (columns kept up to date by triggers, migrations/21.sql)
const getMyCourseVersions = async (request, response) => {
  await mustBeAuthenticated(request.currentUser);

  const rows = await knex('courseUserIsLearning')
    .select('courseUserIsLearning.courseId', 'course.contentVersion', 'courseUserIsLearning.progressVersion')
    .innerJoin('course', 'course.id', 'courseUserIsLearning.courseId')
    .where({
      'courseUserIsLearning.userId': request.currentUser.id,
      'courseUserIsLearning.active': true
    });

  response.success(rows.map((row) => ({
    courseId: row.courseId,
    version: `${row.contentVersion}:${row.progressVersion}`
  })));
};

export default getMyCourseVersions;
