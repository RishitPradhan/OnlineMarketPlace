-- Simple fix for messaging - run this in Supabase SQL Editor

-- 1. Drop restrictive policies
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

-- 3. MOST IMPORTANT: Allow users to read other users for messaging
CREATE POLICY "Users can read other users for messaging"
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

-- 5. Add some test users (optional)
INSERT INTO users (id, email, first_name, last_name, role, password_hash) VALUES
  ('11111111-1111-1111-1111-111111111111', 'john.doe@example.com', 'John', 'Doe', 'client', '$2a$10$dummy.hash.for.testing'),
  ('22222222-2222-2222-2222-222222222222', 'jane.smith@example.com', 'Jane', 'Smith', 'freelancer', '$2a$10$dummy.hash.for.testing'),
  ('33333333-3333-3333-3333-333333333333', 'admin@example.com', 'Admin', 'User', 'admin', '$2a$10$dummy.hash.for.testing')
ON CONFLICT (email) DO NOTHING; 