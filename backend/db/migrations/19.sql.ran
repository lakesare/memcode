-- Migration 19: Add email marketing subscription field
-- Add is_subscribed_to_marketing_emails column to user table
-- Default to true for all existing and new users (opt-out model)

ALTER TABLE "user" 
ADD COLUMN is_subscribed_to_marketing_emails BOOLEAN DEFAULT true NOT NULL;

-- Set all existing users to subscribed (they can opt out via account settings)
UPDATE "user" 
SET is_subscribed_to_marketing_emails = true;