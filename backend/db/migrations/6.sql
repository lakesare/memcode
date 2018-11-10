\c :database;

CREATE TABLE notification (
  id SERIAL PRIMARY KEY,
  -- someone_started_learning_your_course
  -- { learnerUsername, learnerId, courseTitle, courseId }
  -- memcode_added_some_feature
  -- { html }
  -- welcome_to_memcode
  type VARCHAR NOT NULL,
  content JSON NOT NULL,
  if_read BOOLEAN NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT now(),

  user_id INTEGER REFERENCES "user" (id) ON DELETE CASCADE NOT NULL
);
