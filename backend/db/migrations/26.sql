-- [claude comment] Migration 26: bookmarks are no longer scheduled for review
ALTER TABLE pdf_bookmark DROP COLUMN interval_days, DROP COLUMN n_of_reviews, DROP COLUMN next_due_at, DROP COLUMN last_reviewed_at;
