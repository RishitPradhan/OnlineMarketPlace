/*
  # Create messages table for user-to-user messaging

  1. Messages Table
    - `id` (uuid, primary key)
    - `sender_id` (uuid, foreign key to users)
    - `receiver_id` (uuid, foreign key to users, nullable for group messages)
    - `group_id` (uuid, foreign key to groups, nullable for direct messages)
    - `content` (text, not null)
    - `created_at` (timestamp)
    - `updated_at` (timestamp)

  2. Security
    - Enable RLS on messages table
    - Users can read messages they sent or received
    - Users can insert messages they send
    - Users can update/delete their own messages
*/

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  receiver_id uuid REFERENCES users(id) ON DELETE CASCADE,
  group_id uuid, -- Will reference groups table when created
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Ensure either receiver_id or group_id is set, but not both
  CONSTRAINT check_message_type CHECK (
    (receiver_id IS NOT NULL AND group_id IS NULL) OR 
    (receiver_id IS NULL AND group_id IS NOT NULL)
  )
);

-- Enable RLS
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create policies for messages
CREATE POLICY "Users can read messages they sent or received"
  ON messages
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = sender_id OR 
    auth.uid() = receiver_id OR
    auth.uid() IN (
      SELECT user_id FROM group_members WHERE group_id = messages.group_id
    )
  );

CREATE POLICY "Users can insert their own messages"
  ON messages
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update their own messages"
  ON messages
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = sender_id)
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can delete their own messages"
  ON messages
  FOR DELETE
  TO authenticated
  USING (auth.uid() = sender_id);

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_messages_updated_at
  BEFORE UPDATE ON messages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample messages for testing
INSERT INTO messages (sender_id, receiver_id, content, created_at) VALUES
  (
    '11111111-1111-1111-1111-111111111111',
    '22222222-2222-2222-2222-222222222222',
    'Hey Jane! I have a project I need help with.',
    now() - interval '1 hour'
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    '11111111-1111-1111-1111-111111111111',
    'Hi John! I would love to help. What kind of project is it?',
    now() - interval '30 minutes'
  ),
  (
    '11111111-1111-1111-1111-111111111111',
    '22222222-2222-2222-2222-222222222222',
    'It\'s a website redesign. Can we discuss the details?',
    now() - interval '15 minutes'
  )
ON CONFLICT DO NOTHING; 