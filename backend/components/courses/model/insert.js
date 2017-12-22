import { db } from '~/db/init.js';

const insert = {
  create: (course) =>
    db.one(
      "INSERT INTO course (title, description, if_public, course_category_id, user_id, created_at) \
      VALUES (${title}, ${description}, ${ifPublic}, ${courseCategoryId}, ${userId}, timezone('UTC', now())) RETURNING *",
      {
        title: course.title,
        description: course.description,
        ifPublic: course.ifPublic,
        courseCategoryId: course.courseCategoryId || null,
        userId: course.userId
      }
    )
};

export { insert };
