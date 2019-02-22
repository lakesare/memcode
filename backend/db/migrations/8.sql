\c :database;

-- DROP TABLE course_rating_by_user;

CREATE TABLE courseRatingByUser (
  id SERIAL PRIMARY KEY,

  rating INTEGER CHECK (rating >= 1 AND rating <= 5),

  createdAt TIMESTAMP NOT NULL DEFAULT timezone('UTC', now()),
  updatedAt TIMESTAMP NOT NULL DEFAULT timezone('UTC', now()),

  courseId INTEGER REFERENCES course (id) ON DELETE CASCADE NOT NULL,
  userId INTEGER REFERENCES "user" (id) ON DELETE CASCADE NOT NULL
);
