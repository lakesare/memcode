import { db } from '~/db/init.js';

const update = {
  // course: {title: "aaa", userOauthId, userOauthProvider}
  // => { courseId: 5 }
  update: (id, values) =>
    db.any('UPDATE course SET title = ${title} WHERE id = ${id}', {
      title: values.title, id
    })
};

export { update };
