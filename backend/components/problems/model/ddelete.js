import { db } from '~/db/init.js';

const ddelete = {
  deleteMany: (problemIds) =>
    db.none(
      `
      DELETE FROM problem
      WHERE id IN (${problemIds})
      `
    )
};

export { ddelete };
