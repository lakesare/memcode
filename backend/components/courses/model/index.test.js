import { expect } from 'chai';

import { db } from '~/db/init';
import { Factory } from '~/test/Factory';

import * as Course from './index';

const createCourse = async (title) => {
  const course = await Factory.publicCourse();
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
  describe('select', () => {
    describe('search', () => {
      beforeEach('truncating db', () =>
        db.none('TRUNCATE TABLE problem, course, "user" RESTART IDENTITY CASCADE')
      );

      it('case-insensitive', async () => {
        await createCourse('Hello w');
        const course_2 = await createCourse('Right');
        const course_3 = await createCourse('Riper man');

        const courses = await Course.select.search(1, "ri");
        expect(courses.map((c) => c.course.title)).to.have.members([course_2.title, course_3.title]);
        expect(courses.length).to.equal(2);
      });
    });
  });
});
