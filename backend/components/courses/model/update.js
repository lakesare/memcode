import { db } from '~/db/init.js';

const update = {
  // course: {title: "aaa", userOauthId, userOauthProvider}
  // => { courseId: 5 }
  update: course =>
    db.any('UPDATE course SET title = ${title} WHERE id = ${id}', {
      title: course.title, id: course.id
    })
};

export { update };
