import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://xefwxcphnqbmomcljpzn.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhlZnd4Y3BobnFibW9tY2xqcHpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyMTE1NTgsImV4cCI6MjA2Njc4NzU1OH0.SHveyGbir8d5AzkKQeI0hzsK9plCdc_xshKWsom-_OQ';

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key exists:', !!supabaseAnonKey);

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  console.error('VITE_SUPABASE_URL:', supabaseUrl);
  console.error('VITE_SUPABASE_ANON_KEY exists:', !!supabaseAnonKey);
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Test connection
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth state changed:', event, session?.user?.email);
});

// Test real-time connection
supabase
  .channel('test-connection')
  .on('system', { event: 'connect' }, () => {
    console.log('✅ Supabase real-time connected');
  })
  .on('system', { event: 'disconnect' }, () => {
    console.log('❌ Supabase real-time disconnected');
  })
  .subscribe((status) => {
    console.log('🔌 Supabase connection status:', status);
  });