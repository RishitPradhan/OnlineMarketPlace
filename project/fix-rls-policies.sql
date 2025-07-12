-- Fix RLS Policies for Messaging System
-- Run this in your Supabase Dashboard SQL Editor

-- 1. Drop existing restrictive policies
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Users can insert own profile" ON users;
DROP POLICY IF EXISTS "Users can read own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;

-- 2. Create new policies that allow messaging
CREATE POLICY "Users can insert own profile"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can read own profile"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 3. Add policy for users to read basic info of other users for messaging
CREATE POLICY "Users can read basic info of other users"
  ON users
  FOR SELECT
  TO authenticated
  USING (true);

-- 4. Fix messages table policies
DROP POLICY IF EXISTS "Users can read own messages" ON messages;
DROP POLICY IF EXISTS "Users can insert own messages" ON messages;

CREATE POLICY "Users can read messages they sent or received"
  ON messages
  FOR SELECT
  TO authenticated
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can insert messages"
  ON messages
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = sender_id);

-- 5. Add sample users
INSERT INTO users (id, email, first_name, last_name, role, password_hash) VALUES
  ('11111111-1111-1111-1111-111111111111', 'john.doe@example.com', 'John', 'Doe', 'client', '$2a$10$dummy.hash.for.testing'),
  ('22222222-2222-2222-2222-222222222222', 'jane.smith@example.com', 'Jane', 'Smith', 'freelancer', '$2a$10$dummy.hash.for.testing'),
  ('33333333-3333-3333-3333-333333333333', 'admin@example.com', 'Admin', 'User', 'admin', '$2a$10$dummy.hash.for.testing'),
  ('44444444-4444-4444-4444-444444444444', 'alice.johnson@example.com', 'Alice', 'Johnson', 'freelancer', '$2a$10$dummy.hash.for.testing'),
  ('55555555-5555-5555-5555-555555555555', 'bob.wilson@example.com', 'Bob', 'Wilson', 'client', '$2a$10$dummy.hash.for.testing')
ON CONFLICT (email) DO NOTHING;

-- 6. Add sample messages
INSERT INTO messages (sender_id, receiver_id, content, created_at) VALUES
  ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'Hey Jane! I have a project I need help with.', NOW() - INTERVAL '1 hour'),
  ('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'Hi John! I would love to help. What kind of project is it?', NOW() - INTERVAL '30 minutes'),
  ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'It''s a website redesign. Can we discuss the details?', NOW() - INTERVAL '15 minutes'),
  ('44444444-4444-4444-4444-444444444444', '55555555-5555-5555-5555-555555555555', 'Hi Bob! I saw your project post. Are you still looking for a developer?', NOW() - INTERVAL '2 hours'),
  ('55555555-5555-5555-5555-555555555555', '44444444-4444-4444-4444-444444444444', 'Yes Alice! I''m still looking. Can you send me your portfolio?', NOW() - INTERVAL '1 hour')
ON CONFLICT DO NOTHING;

-- 7. Verify the data
SELECT 'Users count:' as info, COUNT(*) as count FROM users
UNION ALL
SELECT 'Messages count:', COUNT(*) FROM messages; 