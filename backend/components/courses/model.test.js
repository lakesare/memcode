import 'source-map-support/register';

import { expect } from 'chai';

import { db } from '../../db/init';
import { deleteCourseWithProblems, updateCourseWithProblems } from './model';


describe('course model', () => {

  beforeEach('truncating db', () => {
    return db.none('TRUNCATE courses, problems RESTART IDENTITY')
  });

  it('deleteCourseWithProblems', async () => {
    const insertedCourse = await db.one('insert into courses (title) values (${title}) returning id', { title: 'hi' });
    const insertedProblems = await db.none('insert into problems (explanation, courseId) values (${explanation}, ${courseId})', { explanation: 'hello', courseId: insertedCourse.id });
    let problemsInDbNow = (await db.any('select id from problems')).length;
    expect(problemsInDbNow).to.equal(1);

    const courseDeleteResult = await deleteCourseWithProblems(1);
    problemsInDbNow = (await db.any('select id from problems')).length;
    expect(problemsInDbNow).to.equal(0);
  });


  it('updateCourseWithProblems', async () => {
    let courseInDbNow, problemsInDbNow;

    const insertedCourse = await db.one('insert into courses (title) values (${title}) returning id', { title: 'hi' });
    const insertedProblems = await db.none('insert into problems (explanation, courseId) values (${explanation}, ${courseId})', { explanation: 'hello', courseId: insertedCourse.id });
    problemsInDbNow = (await db.any('select id from problems')).length;
    expect(problemsInDbNow).to.equal(1);

    const courseDeleteResult = await updateCourseWithProblems(
      {
        id: insertedCourse.id,
        title: 'huh'
      },
      []
    );
    problemsInDbNow = (await db.any('select id from problems')).length;
    expect(problemsInDbNow).to.equal(0);

    courseInDbNow = (await db.one('select title from courses where id = ${id}', { id: insertedCourse.id }));
    expect(courseInDbNow.title).to.equal('huh');
  });

});