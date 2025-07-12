import { createClient } from '@supabase/supabase-js';

// Use the same credentials as in your app
const supabaseUrl = 'https://yibfobsxadyhmurcynrx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpYmZvYnN4YWR5aG11cmN5bnJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE4MDUxMTAsImV4cCI6MjA2NzM4MTExMH0.HPhNXbaR7jgdcYk2iezll7M7RLIdZgeg6lG2sXakdq4';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function debugAuth() {
  console.log('🔍 Debugging Auth System...\n');

  try {
    // Test 1: Check if we can connect to Supabase
    console.log('1️⃣ Testing Supabase connection...');
    const { data: testData, error: testError } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (testError) {
      console.log('❌ Connection test failed:', testError.message);
    } else {
      console.log('✅ Supabase connection successful');
    }

    // Test 2: Try to sign up a test user
    console.log('\n2️⃣ Testing user registration...');
    const testEmail = `test${Date.now()}@example.com`;
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
      console.log('Error details:', signUpError);
    } else {
      console.log('✅ Sign up successful');
      console.log('User ID:', signUpData.user?.id);
    }

    // Test 3: Try to insert user profile
    if (signUpData?.user) {
      console.log('\n3️⃣ Testing user profile creation...');
      const { data: profileData, error: profileError } = await supabase
        .from('users')
        .insert([{
          id: signUpData.user.id,
          email: testEmail,
          first_name: 'Test',
          last_name: 'User',
          role: 'client',
          password_hash: 'managed_by_supabase',
        }])
        .select()
        .single();

      if (profileError) {
        console.log('❌ Profile creation failed:', profileError.message);
        console.log('Error details:', profileError);
      } else {
        console.log('✅ Profile creation successful');
      }
    }

    // Test 4: Try to sign in
    console.log('\n4️⃣ Testing user login...');
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword,
    });

    if (signInError) {
      console.log('❌ Sign in failed:', signInError.message);
    } else {
      console.log('✅ Sign in successful');
    }

    // Test 5: Check current policies
    console.log('\n5️⃣ Checking current RLS policies...');
    const { data: policies, error: policiesError } = await supabase
      .from('information_schema.policies')
      .select('*')
      .eq('table_name', 'users');

    if (policiesError) {
      console.log('❌ Could not check policies:', policiesError.message);
    } else {
      console.log('✅ Current policies:', policies?.length || 0);
      policies?.forEach(policy => {
        console.log(`   - ${policy.policy_name}: ${policy.permissive ? 'PERMISSIVE' : 'RESTRICTIVE'}`);
      });
    }

    console.log('\n🎯 Debug Summary:');
    console.log('If sign up failed, the issue is likely:');
    console.log('  1. RLS policies blocking user creation');
    console.log('  2. Supabase Auth configuration issues');
    console.log('  3. Network connectivity problems');
    console.log('\nIf sign up succeeded but profile creation failed:');
    console.log('  1. RLS policies blocking INSERT on users table');
    console.log('  2. Missing INSERT policy for authenticated users');

  } catch (error) {
    console.error('❌ Debug script error:', error);
  }
}

debugAuth(); 