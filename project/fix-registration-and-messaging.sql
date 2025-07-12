-- Comprehensive fix for registration and messaging
-- Run this in your Supabase SQL Editor

-- 1. Drop ALL existing policies to start fresh
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Users can insert own profile" ON users;
DROP POLICY IF EXISTS "Users can read own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can read basic info of other users" ON users;
DROP POLICY IF EXISTS "Users can read other users for messaging" ON users;

-- 2. Create comprehensive policies for users table
-- Allow users to insert their own profile (for registration)
CREATE POLICY "Users can insert own profile"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Allow users to read their own profile
CREATE POLICY "Users can read own profile"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- MOST IMPORTANT: Allow users to read other users for messaging
CREATE POLICY "Users can read other users for messaging"
  ON users
  FOR SELECT
  TO authenticated
  USING (true);

-- 3. Fix messages table policies
DROP POLICY IF EXISTS "Users can read own messages" ON messages;
DROP POLICY IF EXISTS "Users can insert own messages" ON messages;
DROP POLICY IF EXISTS "Users can read messages they sent or received" ON messages;
DROP POLICY IF EXISTS "Users can insert messages" ON messages;

-- Allow users to read messages they sent or received
CREATE POLICY "Users can read messages they sent or received"
  ON messages
  FOR SELECT
  TO authenticated
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- Allow users to insert messages
CREATE POLICY "Users can insert messages"
  ON messages
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = sender_id);

-- 4. Add some test users (optional)
INSERT INTO users (id, email, first_name, last_name, role, password_hash) VALUES
  ('11111111-1111-1111-1111-111111111111', 'john.doe@example.com', 'John', 'Doe', 'client', '$2a$10$dummy.hash.for.testing'),
  ('22222222-2222-2222-2222-222222222222', 'jane.smith@example.com', 'Jane', 'Smith', 'freelancer', '$2a$10$dummy.hash.for.testing'),
  ('33333333-3333-3333-3333-333333333333', 'admin@example.com', 'Admin', 'User', 'admin', '$2a$10$dummy.hash.for.testing'),
  ('44444444-4444-4444-4444-444444444444', 'alice.johnson@example.com', 'Alice', 'Johnson', 'freelancer', '$2a$10$dummy.hash.for.testing'),
  ('55555555-5555-5555-5555-555555555555', 'bob.wilson@example.com', 'Bob', 'Wilson', 'client', '$2a$10$dummy.hash.for.testing')
ON CONFLICT (email) DO NOTHING;

-- 5. Add sample messages
INSERT INTO messages (sender_id, receiver_id, content, created_at) VALUES
  ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'Hey Jane! I have a project I need help with.', NOW() - INTERVAL '1 hour'),
  ('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'Hi John! I would love to help. What kind of project is it?', NOW() - INTERVAL '30 minutes'),
  ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'It''s a website redesign. Can we discuss the details?', NOW() - INTERVAL '15 minutes')
ON CONFLICT DO NOTHING;

-- 6. Verify the setup
SELECT 'Users count:' as info, COUNT(*) as count FROM users
UNION ALL
SELECT 'Messages count:', COUNT(*) FROM messages; 