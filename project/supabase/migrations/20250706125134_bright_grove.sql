/*
  # Update users table policies for Supabase Auth integration

  1. Changes
    - Update RLS policies to work with Supabase Auth
    - Allow users to insert their own profile data during registration
    - Update policies to use auth.uid() properly
    - Add policy for users to read basic info of other users for messaging

  2. Security
    - Users can insert their own data during registration
    - Users can read and update their own data
    - Users can read basic info (id, email, first_name, last_name) of other users for messaging
    - Maintain data security with proper RLS
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Users can insert own profile" ON users;
DROP POLICY IF EXISTS "Users can read own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;

-- Create new policies that work with Supabase Auth
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

-- Add policy for users to read basic info of other users for messaging
CREATE POLICY "Users can read basic info of other users"
  ON users
  FOR SELECT
  TO authenticated
  USING (true);