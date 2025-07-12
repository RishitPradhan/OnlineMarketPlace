import { createClient } from '@supabase/supabase-js';

// Use the same credentials as in your app
const supabaseUrl = 'https://yibfobsxadyhmurcynrx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpYmZvYnN4YWR5aG11cmN5bnJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE4MDUxMTAsImV4cCI6MjA2NzM4MTExMH0.HPhNXbaR7jgdcYk2iezll7M7RLIdZgeg6lG2sXakdq4';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function addUsersDirect() {
  console.log('🔧 Adding users directly to database...\n');

  try {
    // First, let's check what's currently in the users table
    console.log('📊 Checking current users...');
    const { data: currentUsers, error: fetchError } = await supabase
      .from('users')
      .select('id, email, first_name, last_name, role');

    if (fetchError) {
      console.log('❌ Error fetching users:', fetchError.message);
      console.log('This suggests RLS policies are blocking access.');
    } else {
      console.log('✅ Users table accessible');
      console.log('📋 Current users:', currentUsers?.length || 0);
      if (currentUsers && currentUsers.length > 0) {
        currentUsers.forEach(user => {
          console.log(`   - ${user.email} (${user.first_name} ${user.last_name}) - ${user.role}`);
        });
      }
    }

    // Let's try a different approach - create users one by one with error handling
    console.log('\n👥 Attempting to add sample users...');
    
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
    ];

    let successCount = 0;
    for (const user of sampleUsers) {
      try {
        // Try to insert the user
        const { error } = await supabase
          .from('users')
          .upsert([user], { onConflict: 'email' });
        
        if (error) {
          console.log(`❌ Failed to add ${user.email}: ${error.message}`);
          
          // If it's an RLS error, let's try to understand what's happening
          if (error.message.includes('row-level security')) {
            console.log(`   🔒 RLS policy blocking insert for ${user.email}`);
          }
        } else {
          console.log(`✅ Successfully added: ${user.email}`);
          successCount++;
        }
      } catch (err) {
        console.log(`❌ Exception adding ${user.email}:`, err.message);
      }
    }

    console.log(`\n📊 Results: ${successCount}/${sampleUsers.length} users added successfully`);

    if (successCount === 0) {
      console.log('\n🔧 The issue is with RLS policies. Here\'s what you need to do:');
      console.log('\n1. Go to your Supabase Dashboard: https://supabase.com/dashboard');
      console.log('2. Select your project');
      console.log('3. Go to Authentication > Policies');
      console.log('4. Find the "users" table');
      console.log('5. Add a new policy with these settings:');
      console.log('   - Policy name: "Allow users to read other users for messaging"');
      console.log('   - Target roles: authenticated');
      console.log('   - Using expression: true');
      console.log('   - Operation: SELECT');
      console.log('\n6. Or run this SQL in the SQL Editor:');
      console.log('   CREATE POLICY "Users can read basic info of other users"');
      console.log('     ON users FOR SELECT TO authenticated USING (true);');
    } else {
      console.log('\n🎉 Users added successfully!');
      console.log('Now test your messaging system.');
    }

  } catch (error) {
    console.error('❌ Error in script:', error);
  }
}

addUsersDirect(); 