\c :database;

CREATE TABLE notification (
  id SERIAL PRIMARY KEY,
  type VARCHAR NOT NULL,
  content JSON NOT NULL,
  if_read BOOLEAN NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT now(),

  user_id INTEGER REFERENCES "user" (id) ON DELETE CASCADE NOT NULL
);
