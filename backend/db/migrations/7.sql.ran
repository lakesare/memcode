\c :database;

-- I made a mistake of using now() instead of timezone('UTC', now()) for defaults
-- it's fine in production since heroku's postgres uses UTC as default timezone, but let's change it for localhost

ALTER TABLE "user"
ALTER COLUMN created_at
SET DEFAULT timezone('UTC', now());

ALTER TABLE "course"
ALTER COLUMN created_at
SET DEFAULT timezone('UTC', now());

ALTER TABLE "course_user_is_learning"
ALTER COLUMN started_learning_at
SET DEFAULT timezone('UTC', now());

ALTER TABLE "problem_user_is_learning"
ALTER COLUMN last_reviewed_at
SET DEFAULT timezone('UTC', now());

ALTER TABLE "notification"
ALTER COLUMN created_at
SET DEFAULT timezone('UTC', now());
