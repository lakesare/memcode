import db from '~/db/init.js';

const select = {
  one: (id) =>
    db.one(
      'SELECT * FROM problem WHERE id = ${id}',
      { id }
    ),
  all: () =>
    db.any('SELECT * FROM problem')
};

export default select;
