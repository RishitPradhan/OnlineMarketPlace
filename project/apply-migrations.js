const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials. Please check your .env file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function applyMigrations() {
  console.log('🚀 Applying database migrations...\n');

  try {
    // Migration 1: Update RLS policies
    console.log('📝 Applying RLS policy updates...');
    const { error: policyError } = await supabase.rpc('exec_sql', {
      sql: `
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
      `
    });

    if (policyError) {
      console.log('⚠️  Policy update warning (might already exist):', policyError.message);
    } else {
      console.log('✅ RLS policies updated successfully');
    }

    // Migration 2: Add sample users
    console.log('\n👥 Adding sample users...');
    const { error: usersError } = await supabase
      .from('users')
      .upsert([
        {
          id: '11111111-1111-1111-1111-111111111111',
          email: 'john.doe@example.com',
          first_name: 'John',
          last_name: 'Doe',
          role: 'client',
          password_hash: '$2a$10$dummy.hash.for.testing'
        },
        {
          id: '22222222-2222-2222-2222-222222222222',
          email: 'jane.smith@example.com',
          first_name: 'Jane',
          last_name: 'Smith',
          role: 'freelancer',
          password_hash: '$2a$10$dummy.hash.for.testing'
        },
        {
          id: '33333333-3333-3333-3333-333333333333',
          email: 'admin@example.com',
          first_name: 'Admin',
          last_name: 'User',
          role: 'admin',
          password_hash: '$2a$10$dummy.hash.for.testing'
        },
        {
          id: '44444444-4444-4444-4444-444444444444',
          email: 'alice.johnson@example.com',
          first_name: 'Alice',
          last_name: 'Johnson',
          role: 'freelancer',
          password_hash: '$2a$10$dummy.hash.for.testing'
        },
        {
          id: '55555555-5555-5555-5555-555555555555',
          email: 'bob.wilson@example.com',
          first_name: 'Bob',
          last_name: 'Wilson',
          role: 'client',
          password_hash: '$2a$10$dummy.hash.for.testing'
        }
      ], { onConflict: 'email' });

    if (usersError) {
      console.log('⚠️  Users insert warning (might already exist):', usersError.message);
    } else {
      console.log('✅ Sample users added successfully');
    }

    // Migration 3: Create messages table and add sample messages
    console.log('\n💬 Creating messages table...');
    
    // First, let's check if messages table exists
    const { data: tables, error: tableCheckError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'messages');

    if (tableCheckError) {
      console.log('⚠️  Could not check if messages table exists:', tableCheckError.message);
    }

    if (!tables || tables.length === 0) {
      console.log('📝 Creating messages table...');
      // Note: Table creation might require admin privileges
      console.log('⚠️  Messages table creation requires admin privileges. Please create it manually in Supabase Dashboard.');
    } else {
      console.log('✅ Messages table already exists');
    }

    // Add sample messages
    console.log('\n💬 Adding sample messages...');
    const { error: messagesError } = await supabase
      .from('messages')
      .upsert([
        {
          sender_id: '11111111-1111-1111-1111-111111111111',
          receiver_id: '22222222-2222-2222-2222-222222222222',
          content: 'Hey Jane! I have a project I need help with.',
          created_at: new Date(Date.now() - 60 * 60 * 1000).toISOString() // 1 hour ago
        },
        {
          sender_id: '22222222-2222-2222-2222-222222222222',
          receiver_id: '11111111-1111-1111-1111-111111111111',
          content: 'Hi John! I would love to help. What kind of project is it?',
          created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString() // 30 minutes ago
        },
        {
          sender_id: '11111111-1111-1111-1111-111111111111',
          receiver_id: '22222222-2222-2222-2222-222222222222',
          content: 'It\'s a website redesign. Can we discuss the details?',
          created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString() // 15 minutes ago
        }
      ], { onConflict: 'id' });

    if (messagesError) {
      console.log('⚠️  Messages insert warning (might already exist):', messagesError.message);
    } else {
      console.log('✅ Sample messages added successfully');
    }

    console.log('\n🎉 Migrations completed!');
    console.log('📋 Next steps:');
    console.log('   1. Refresh your app');
    console.log('   2. Go to Messages tab');
    console.log('   3. You should now see users in the sidebar');

  } catch (error) {
    console.error('❌ Error applying migrations:', error);
  }
}

applyMigrations(); 