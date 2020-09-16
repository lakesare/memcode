\c :database;

-- Changing all timestamps to timestamptzs
ALTER TABLE problem_user_is_learning ALTER next_due_date TYPE timestamptz USING next_due_date AT TIME ZONE 'UTC';
ALTER TABLE problem_user_is_learning ALTER last_reviewed_at TYPE timestamptz USING last_reviewed_at AT TIME ZONE 'UTC';
ALTER TABLE course_user_is_learning ALTER started_learning_at TYPE timestamptz USING started_learning_at AT TIME ZONE 'UTC';
ALTER TABLE notification ALTER created_at TYPE timestamptz USING created_at AT TIME ZONE 'UTC';
ALTER TABLE course_rating ALTER created_at TYPE timestamptz USING created_at AT TIME ZONE 'UTC';
ALTER TABLE course_rating ALTER updated_at TYPE timestamptz USING updated_at AT TIME ZONE 'UTC';
ALTER TABLE coauthor ALTER created_at TYPE timestamptz USING created_at AT TIME ZONE 'UTC';
ALTER TABLE "user" ALTER created_at TYPE timestamptz USING created_at AT TIME ZONE 'UTC';
ALTER TABLE course ALTER created_at TYPE timestamptz USING created_at AT TIME ZONE 'UTC';
ALTER TABLE problem ALTER created_at TYPE timestamptz USING created_at AT TIME ZONE 'UTC';
