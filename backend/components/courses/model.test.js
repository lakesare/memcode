import { expect } from 'chai';

import { db } from '../../db/init';
import { deleteCourseWithProblems } from './model';


describe('course model', () => {

  beforeEach('truncating db', () => {
    return db.none('TRUNCATE courses, problems RESTART IDENTITY')
  });



  it('deleteCourseWithProblems', () => {


    return(


      db.none('insert into courses (title) values (${title})', { title: 'hi' })
        .then(() => {
        return(
          db.none('insert into problems (explanation, courseId) values (${explanation}, ${courseId})', { explanation: 'hello', courseId: 1 })
        )
      }).then(() => {
        return(
          deleteCourseWithProblems(1).then((data) => {
            expect(data.data).to.equal(true);
            return(
              db.any('select id from problems').then((problems) => {
                const problemIds = problems.map((problem) => problem.id);
                expect(problemIds).to.deep.equal([]);
              })
            )//
          })
        )//
      })



    )
    
  });

});