-- Fix Email Confirmation Issues
-- Run these commands in your Supabase Dashboard SQL Editor

-- 1. Confirm all existing users (if you want to bypass email confirmation)
UPDATE auth.users 
SET email_confirmed_at = NOW() 
WHERE email_confirmed_at IS NULL;

-- 2. Confirm specific user by email (replace with your email)
-- UPDATE auth.users 
-- SET email_confirmed_at = NOW() 
-- WHERE email = 'ayush.pradhan6620@gmail.com';

-- 3. Check current users and their confirmation status
SELECT 
    id,
    email,
    email_confirmed_at,
    created_at,
    CASE 
        WHEN email_confirmed_at IS NULL THEN 'NOT CONFIRMED'
        ELSE 'CONFIRMED'
    END as status
FROM auth.users 
ORDER BY created_at DESC;

-- 4. Disable email confirmation for new users (optional - for testing only)
-- Go to Supabase Dashboard > Authentication > Settings
-- Disable "Enable email confirmations"

-- 5. Alternative: Update specific user by ID (if you know the user ID)
-- UPDATE auth.users 
-- SET email_confirmed_at = NOW() 
-- WHERE id = 'your-user-id-here';

-- Note: After running these commands, try logging in again.
-- The login should work without email confirmation. 