import { db } from '~/db/init.js';

const update = (problem, problemId) =>
  db.one(
    "UPDATE problem SET content=${content} WHERE id=${id} RETURNING *",
    {
      content: problem.content,
      id: problemId
    }
  );

import { insert } from './insert';
import { select } from './select';
import { ddelete } from './ddelete';

export { insert, select, update, ddelete };
