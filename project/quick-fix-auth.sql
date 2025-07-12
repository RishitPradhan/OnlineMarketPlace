-- Quick fix for auth - temporarily disable RLS for testing
-- Run this in your Supabase SQL Editor

-- 1. Temporarily disable RLS on users table for testing
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- 2. Check if this fixes the issue
-- Try registering a user in your app now

-- 3. If registration works, re-enable RLS with proper policies
-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- 
-- CREATE POLICY "Users can insert own profile"
--   ON users FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
-- 
-- CREATE POLICY "Users can read own profile"
--   ON users FOR SELECT TO authenticated USING (auth.uid() = id);
-- 
-- CREATE POLICY "Users can read other users for messaging"
--   ON users FOR SELECT TO authenticated USING (true); 