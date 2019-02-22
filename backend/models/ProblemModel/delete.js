import db from '~/db/init.js';

const deleteMany = (problemIds) =>
  db.none(
    `
    DELETE FROM problem
    WHERE id IN (${problemIds})
    `
  );

export default { deleteMany };
