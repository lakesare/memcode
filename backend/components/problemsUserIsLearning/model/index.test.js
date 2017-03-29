import { expect } from 'chai';

import { db } from '~/db/init';


import { Factory } from '~/test/Factory';

describe('course model', () => {
  beforeEach('truncating db', () => {
    return db.none('TRUNCATE * RESTART IDENTITY');
  });

  it('deleteCourseWithProblems', async () => {

    const puil = Factory.problemUserIsLearning();

    console.log(puil);
    expect(puil.id).to.equal(1);


  });
});
