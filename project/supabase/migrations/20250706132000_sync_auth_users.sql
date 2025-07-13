/*
  # Sync existing auth users to users table for messaging functionality

  This migration ensures that all users who registered through Supabase Auth
  are also present in the users table for messaging functionality.

  The messaging system requires users to exist in the users table,
  but registration only creates auth.users entries.
*/

-- Function to sync auth users to users table
CREATE OR REPLACE FUNCTION sync_auth_users_to_users_table()
RETURNS void AS $$
DECLARE
  auth_user RECORD;
BEGIN
  -- Loop through all auth users and insert them into users table if they don't exist
  FOR auth_user IN 
    SELECT 
      id,
      email,
      raw_user_meta_data->>'first_name' as first_name,
      raw_user_meta_data->>'last_name' as last_name,
      raw_user_meta_data->>'role' as role,
      created_at,
      updated_at
    FROM auth.users
  LOOP
    -- Insert user if they don't exist in users table
    INSERT INTO users (id, email, first_name, last_name, role, password_hash, created_at, updated_at)
    VALUES (
      auth_user.id,
      auth_user.email,
      COALESCE(auth_user.first_name, 'User'),
      COALESCE(auth_user.last_name, ''),
      COALESCE(auth_user.role, 'client')::user_role,
      'synced_from_auth',
      auth_user.created_at,
      auth_user.updated_at
    )
    ON CONFLICT (id) DO NOTHING;
  END LOOP;
  
  RAISE NOTICE 'Auth users synced to users table successfully';
END;
$$ LANGUAGE plpgsql;

-- Execute the sync function
SELECT sync_auth_users_to_users_table();

-- Drop the function after use
DROP FUNCTION sync_auth_users_to_users_table();

-- Create a trigger to automatically sync new auth users
CREATE OR REPLACE FUNCTION sync_new_auth_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO users (id, email, first_name, last_name, role, password_hash, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', 'User'),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'client')::user_role,
    'synced_from_auth',
    NEW.created_at,
    NEW.updated_at
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    role = EXCLUDED.role,
    updated_at = EXCLUDED.updated_at;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger on auth.users table
DROP TRIGGER IF EXISTS auth_users_sync_trigger ON auth.users;
CREATE TRIGGER auth_users_sync_trigger
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION sync_new_auth_user(); 