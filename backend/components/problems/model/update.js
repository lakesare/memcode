import { db } from '~/db/init.js';

const update = (problem, problemId) =>
  db.one(
    "UPDATE problem SET content=${content} WHERE id=${id} RETURNING *",
    {
      content: problem.content,
      id: problemId
    }
  );

const updatePosition = ({ id, position }) =>
  db.one(
    `
    UPDATE problem
    SET position = \${position}
    WHERE id = \${id}
    RETURNING *
    `,
    { id, position }
  );

export default { update, updatePosition };
