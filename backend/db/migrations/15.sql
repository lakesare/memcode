\c :database;

-- Add password support for local authentication
-- For password users: oauth_provider = 'password', oauth_id = username
-- This reuses existing unique constraint (oauth_provider, oauth_id)

-- Add password hash field for local auth
ALTER TABLE "user" ADD COLUMN password_hash VARCHAR;
