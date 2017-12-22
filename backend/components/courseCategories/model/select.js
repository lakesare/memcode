import { db } from '~/db/init.js';
// import { camelizeDbColumns } from '~/services/camelizeDbColumns';
import { integerizeDbColumns } from '~/services/integerizeDbColumns';
import wherePublic from '~/components/courses/model/select/services/wherePublic';

export default {
  // .any always returns an array ([] one if nothing is present)
  all: () =>
    db.any(`
      SELECT
        course_category.*,
        COUNT(course.id) AS amount_of_courses
      FROM course_category
      LEFT OUTER JOIN course
        ON
          course.course_category_id = course_category.id
            AND
          ${wherePublic}
      GROUP BY course_category.id
    `)
      .then((array) => integerizeDbColumns(array, ['amountOfCourses'])),

  allCourseCategoryGroups: () =>
    db.any(`SELECT * FROM course_category_group`)
};
