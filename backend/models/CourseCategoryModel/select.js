import db from '~/db/init.js';
// import { camelizeDbColumns } from '~/services/camelizeDbColumns';
import { integerizeDbColumns } from '~/services/integerizeDbColumns';
import wherePublic from '~/models/CourseModel/select/services/wherePublic';

// .any always returns an array ([] one if nothing is present)
const all = () =>
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
      .then((array) => integerizeDbColumns(array, ['amountOfCourses']));

const allCourseCategoryGroups = () =>
  db.any(`SELECT * FROM course_category_group`);

export default { all, allCourseCategoryGroups };
