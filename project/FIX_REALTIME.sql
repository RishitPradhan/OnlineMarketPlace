-- Quick fix for real-time messaging issues
-- Run this in your Supabase Dashboard SQL Editor

-- 1. Enable real-time for messages table
ALTER PUBLICATION supabase_realtime ADD TABLE messages;

-- 2. Sync all auth users to users table
INSERT INTO users (id, email, first_name, last_name, role, password_hash, created_at, updated_at)
SELECT 
  id,
  email,
  COALESCE(raw_user_meta_data->>'first_name', 'User'),
  COALESCE(raw_user_meta_data->>'last_name', ''),
  COALESCE(raw_user_meta_data->>'role', 'client')::user_role,
  'synced_from_auth',
  created_at,
  updated_at
FROM auth.users
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  role = EXCLUDED.role,
  updated_at = EXCLUDED.updated_at;

-- 3. Check if real-time is working
SELECT * FROM pg_publication_tables WHERE pubname = 'supabase_realtime';

-- 4. Verify users are synced
SELECT 'auth.users' as table_name, count(*) as count FROM auth.users
UNION ALL
SELECT 'users' as table_name, count(*) as count FROM users;

-- 5. Check messages table
SELECT count(*) as message_count FROM messages; 