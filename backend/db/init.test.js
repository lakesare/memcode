import { expect } from 'chai';

import { db } from './init.js';

// TODO if there'll be some more meta testing, put it to /tests dir together with configs.
describe('testing tests', () => {

  it('db truncation', () => {
    const promiseToTruncateDb = 
      db.none('TRUNCATE courses, problems RESTART IDENTITY').then(() => {
        return(
          db.any('select * from courses').then((noData) => {
            expect(noData).to.deep.equal([])
          })
        )
      })

    const promise = db.none('insert into courses (title) values (${title})', { title: 'hello' })
      .then(() => (
        db.any('select * from courses').then((isData) => {  
          expect(isData).to.deep.equal([ { id: 1, title: 'hello', userOauthProvider: null, userOauthId: null } ]);
          return promiseToTruncateDb
        })
      ));

    return promise;
  });

  describe('db truncation in before hook', () => {

    beforeEach('truncating db', () => {
      return db.none('TRUNCATE courses, problems RESTART IDENTITY')
    });

    it('inserting data into db', () => {
      return db.none('insert into courses (title) values (${title})', { title: 'hello' })
      
    });

    it('not seeing data in the db', () => {
      return db.any('select * from courses').then((data) => {  
        expect(data).to.deep.equal([]);
      })
    })

  });

});
