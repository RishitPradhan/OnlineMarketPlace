import { createClient } from '@supabase/supabase-js';

// Use the same credentials as in your app
const supabaseUrl = 'https://yibfobsxadyhmurcynrx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpYmZvYnN4YWR5aG11cmN5bnJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE4MDUxMTAsImV4cCI6MjA2NzM4MTExMH0.HPhNXbaR7jgdcYk2iezll7M7RLIdZgeg6lG2sXakdq4';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function fixMessaging() {
  console.log('🔧 Fixing messaging system...\n');

  try {
    // Step 1: Check if users table exists and has data
    console.log('📊 Checking users table...');
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email, first_name, last_name')
      .limit(5);

    if (usersError) {
      console.log('❌ Error fetching users:', usersError.message);
      console.log('This might be due to RLS policies. Let\'s try to add users anyway...');
    } else {
      console.log('✅ Users table accessible');
      console.log('📋 Current users:', users?.length || 0);
      if (users && users.length > 0) {
        users.forEach(user => console.log(`   - ${user.email} (${user.first_name} ${user.last_name})`));
      }
    }

    // Step 2: Try to add sample users (this might fail due to RLS)
    console.log('\n👥 Adding sample users...');
    const sampleUsers = [
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
      }
    ];

    for (const user of sampleUsers) {
      const { error } = await supabase
        .from('users')
        .upsert([user], { onConflict: 'email' });
      
      if (error) {
        console.log(`⚠️  Could not add ${user.email}:`, error.message);
      } else {
        console.log(`✅ Added user: ${user.email}`);
      }
    }

    // Step 3: Check if messages table exists
    console.log('\n💬 Checking messages table...');
    const { data: messages, error: messagesError } = await supabase
      .from('messages')
      .select('id, sender_id, receiver_id, content')
      .limit(5);

    if (messagesError) {
      console.log('❌ Error fetching messages:', messagesError.message);
      console.log('Messages table might not exist or have RLS issues.');
    } else {
      console.log('✅ Messages table accessible');
      console.log('📋 Current messages:', messages?.length || 0);
    }

    // Step 4: Try to add sample messages
    console.log('\n💬 Adding sample messages...');
    const sampleMessages = [
      {
        sender_id: '11111111-1111-1111-1111-111111111111',
        receiver_id: '22222222-2222-2222-2222-222222222222',
        content: 'Hey Jane! I have a project I need help with.',
        created_at: new Date(Date.now() - 60 * 60 * 1000).toISOString()
      },
      {
        sender_id: '22222222-2222-2222-2222-222222222222',
        receiver_id: '11111111-1111-1111-1111-111111111111',
        content: 'Hi John! I would love to help. What kind of project is it?',
        created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString()
      }
    ];

    for (const message of sampleMessages) {
      const { error } = await supabase
        .from('messages')
        .upsert([message], { onConflict: 'id' });
      
      if (error) {
        console.log(`⚠️  Could not add message:`, error.message);
      } else {
        console.log(`✅ Added message from ${message.sender_id} to ${message.receiver_id}`);
      }
    }

    console.log('\n🎉 Migration script completed!');
    console.log('\n📋 Next steps:');
    console.log('   1. Go to your Supabase Dashboard');
    console.log('   2. Navigate to SQL Editor');
    console.log('   3. Run the following SQL to fix RLS policies:');
    console.log('\n   -- Fix RLS policies for messaging');
    console.log('   DROP POLICY IF EXISTS "Users can read own data" ON users;');
    console.log('   DROP POLICY IF EXISTS "Users can update own data" ON users;');
    console.log('   CREATE POLICY "Users can read basic info of other users"');
    console.log('     ON users FOR SELECT TO authenticated USING (true);');
    console.log('\n   4. Refresh your app and check the Messages tab');

  } catch (error) {
    console.error('❌ Error in migration script:', error);
  }
}

fixMessaging(); 