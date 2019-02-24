\c :database;

-- DROP TABLE courseRatingByUser;

CREATE TABLE course_rating (
  id SERIAL PRIMARY KEY,

  rating INTEGER CHECK (rating >= 1 AND rating <= 5),

  created_at TIMESTAMP NOT NULL DEFAULT timezone('UTC', now()),
  updated_at TIMESTAMP NOT NULL DEFAULT timezone('UTC', now()),

  course_id INTEGER REFERENCES course (id) ON DELETE CASCADE NOT NULL,
  user_id INTEGER REFERENCES "user" (id) ON DELETE CASCADE NOT NULL
);
