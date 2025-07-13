-- Debug and fix real-time messaging issues
-- Run this in your Supabase Dashboard SQL Editor

-- 1. Check if real-time is enabled
SELECT * FROM pg_stat_activity WHERE application_name = 'supabase_realtime';

-- 2. Check current users in auth.users
SELECT id, email, raw_user_meta_data, created_at 
FROM auth.users 
ORDER BY created_at DESC;

-- 3. Check current users in users table
SELECT id, email, first_name, last_name, role, created_at 
FROM users 
ORDER BY created_at DESC;

-- 4. Check if there are any messages
SELECT id, sender_id, receiver_id, content, created_at 
FROM messages 
ORDER BY created_at DESC;

-- 5. Check RLS policies on messages table
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'messages';

-- 6. Test inserting a message (replace with actual user IDs)
-- INSERT INTO messages (sender_id, receiver_id, content) 
-- VALUES ('your-user-id-here', 'your-user-id-here', 'Test message');

-- 7. Check if real-time triggers are working
SELECT * FROM information_schema.triggers 
WHERE event_object_table = 'messages';

-- 8. Enable real-time for messages table (if not already enabled)
ALTER PUBLICATION supabase_realtime ADD TABLE messages;

-- 9. Check publication status
SELECT * FROM pg_publication_tables WHERE pubname = 'supabase_realtime'; 