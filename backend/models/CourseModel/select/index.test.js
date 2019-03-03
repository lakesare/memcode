import { expect } from 'chai';

import db from '~/db/init';
import { Factory } from '~/test/services/Factory';

import Course from '../index';

describe('course model', () => {
  describe('select', () => {
    describe('search', () => {
      beforeEach('truncating db', async () =>
        db.none('TRUNCATE TABLE problem, course, "user" RESTART IDENTITY CASCADE')
      );

      it('case-insensitive', async () => {
        await Factory.publicCourse({ title: 'Hello w' });
        const course_2 = await Factory.publicCourse({ title: 'Right' });
        const course_3 = await Factory.publicCourse({ title: 'Riper man' });

        const courses = await Course.select.search(1, "ri");
        expect(courses.map((c) => c.course.title)).to.have.members([course_2.title, course_3.title]);
        expect(courses.length).to.equal(2);
      });
    });
  });
});
