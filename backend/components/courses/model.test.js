import 'source-map-support/register';

import { expect } from 'chai';

import { db } from '../../db/init';
import { deleteCourseWithProblems, updateCourseWithProblems } from './model';


describe('course model', () => {
  beforeEach('truncating db', () => {
    return db.none('TRUNCATE course, problem RESTART IDENTITY');
  });

  it('deleteCourseWithProblems', async () => {
    const insertedCourse = await db.one('insert into course (title) values (${title}) returning id', { title: 'hi' });
    // insert problems
    await db.none('insert into problems (explanation, course_id) values (${explanation}, ${courseId})', { explanation: 'hello', courseId: insertedCourse.id });
    let problemsInDbNow = (await db.any('select id from problems')).length;
    expect(problemsInDbNow).to.equal(1);

    // delete course
    await deleteCourseWithProblems(1);

    problemsInDbNow = (await db.any('select id from problems')).length;
    expect(problemsInDbNow).to.equal(0);
  });
});
