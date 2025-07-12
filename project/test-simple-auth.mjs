import { createClient } from '@supabase/supabase-js';

// Use the same credentials as in your app
const supabaseUrl = 'https://yibfobsxadyhmurcynrx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpYmZvYnN4YWR5aG11cmN5bnJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE4MDUxMTAsImV4cCI6MjA2NzM4MTExMH0.HPhNXbaR7jgdcYk2iezll7M7RLIdZgeg6lG2sXakdq4';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testSimpleAuth() {
  console.log('🔍 Testing Simple Auth...\n');

  try {
    // Test 1: Try to sign up with a simple email
    console.log('1️⃣ Testing user registration with simple email...');
    const testEmail = 'testuser123@gmail.com';
    const testPassword = 'testpassword123';
    
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          first_name: 'Test',
          last_name: 'User',
          role: 'client',
        }
      }
    });

    if (signUpError) {
      console.log('❌ Sign up failed:', signUpError.message);
      console.log('Error code:', signUpError.status);
      console.log('Full error:', signUpError);
    } else {
      console.log('✅ Sign up successful');
      console.log('User ID:', signUpData.user?.id);
      console.log('Email confirmed:', signUpData.user?.email_confirmed_at);
    }

    // Test 2: Check if we can read users table
    console.log('\n2️⃣ Testing users table access...');
    const { data: usersData, error: usersError } = await supabase
      .from('users')
      .select('id, email')
      .limit(5);

    if (usersError) {
      console.log('❌ Users table access failed:', usersError.message);
    } else {
      console.log('✅ Users table accessible');
      console.log('Users found:', usersData?.length || 0);
    }

    // Test 3: Try to insert a test user directly
    console.log('\n3️⃣ Testing direct user insertion...');
    const testUserId = 'test-user-' + Date.now();
    const { data: insertData, error: insertError } = await supabase
      .from('users')
      .insert([{
        id: testUserId,
        email: 'directtest@gmail.com',
        first_name: 'Direct',
        last_name: 'Test',
        role: 'client',
        password_hash: 'test_hash',
      }])
      .select()
      .single();

    if (insertError) {
      console.log('❌ Direct insertion failed:', insertError.message);
      console.log('Error details:', insertError);
    } else {
      console.log('✅ Direct insertion successful');
    }

    console.log('\n🎯 Summary:');
    console.log('If sign up failed with email validation error:');
    console.log('  - Check Supabase Auth settings');
    console.log('  - Try with a different email domain');
    console.log('If users table access failed:');
    console.log('  - RLS policies are blocking access');
    console.log('If direct insertion failed:');
    console.log('  - RLS policies are blocking INSERT operations');

  } catch (error) {
    console.error('❌ Test error:', error);
  }
}

testSimpleAuth(); 