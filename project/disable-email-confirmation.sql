-- Disable email confirmation for testing
-- Run this in your Supabase Dashboard SQL Editor

-- Update auth.users to confirm all existing users
UPDATE auth.users 
SET email_confirmed_at = NOW() 
WHERE email_confirmed_at IS NULL;

-- You can also disable email confirmation for new users in Supabase Dashboard:
-- 1. Go to Authentication > Settings
-- 2. Disable "Enable email confirmations"
-- 3. Or set "Confirm email" to "No"

-- Note: This is for testing only. In production, you should keep email confirmation enabled. 