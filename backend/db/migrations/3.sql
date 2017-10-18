\c :database;

ALTER TABLE "problem_user_is_learning"
  ADD COLUMN if_ignored BOOLEAN DEFAULT false;
