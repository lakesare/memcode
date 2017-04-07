import { db } from '~/db/init.js';

const update = (problem, problemId) =>
  db.one(
    "UPDATE problem SET content=${content} WHERE id=${id} RETURNING *",
    {
      content: problem.content,
      id: problemId
    }
  );

const destroy = (id) =>
  db.none('delete from problem where id=${id}', { id });

import { insert } from './insert';
import { select } from './select';

export { insert, select, update, destroy };
