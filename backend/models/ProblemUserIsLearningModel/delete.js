import db from '~/db/init.js';

const ddelete = {
  ddelete: (id) =>
    db.none('DELETE FROM problem_user_is_learning WHERE id=${id}', { id })
};

export default { ddelete };
