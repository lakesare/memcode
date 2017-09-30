import { expect } from 'chai';

import { db } from '~/db/init';
import { Factory } from '~/test/Factory';

import * as Course from './index';

const createCourse = async (title) => {
  const course = await Factory.course();
  return db.one(
    `
      UPDATE course
      SET title = \${title}
      WHERE id = \${id}
      RETURNING *
    `,
    { id: course.id, title }
  );
};

describe('course model', () => {
  beforeEach('truncating db', () => db.none('DELETE FROM "user"'));

  it('deleteCourseWithProblems', async () => {
    const course_1 = await createCourse('Hello interesting');
    const course_2 = await createCourse('Right');
    const course_3 = await createCourse('Super man');


    const results = await Course.select.search(1, "a");
    console.log(results);
    expect().to.equal(1);
  });
});
