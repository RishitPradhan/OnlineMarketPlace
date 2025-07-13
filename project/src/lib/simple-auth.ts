import { supabase } from './supabase';
import { User, RegisterData, LoginData } from '../types';

export const simpleAuthService = {
  async register(userData: RegisterData): Promise<User> {
    try {
      console.log('🔐 Starting registration for:', userData.email);
      
      // Only use Supabase Auth, no custom table
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            first_name: userData.firstName,
            last_name: userData.lastName,
            role: userData.role,
          }
        }
      });

      console.log('Auth signup result:', { authData, authError });

      if (authError) {
        console.error('Auth signup error:', authError);
        throw new Error(authError.message);
      }
      
      if (!authData.user) {
        throw new Error('Registration failed - no user returned');
      }

      // Sync user data to users table for messaging functionality
      try {
        const { error: syncError } = await supabase
          .from('users')
          .insert({
            id: authData.user.id,
            email: userData.email,
            first_name: userData.firstName,
            last_name: userData.lastName,
            role: userData.role as 'client' | 'freelancer' | 'admin',
            password_hash: 'synced_from_auth' // Placeholder since we don't store passwords
          });

        if (syncError) {
          console.warn('Failed to sync user to users table:', syncError);
          // Don't throw error here as auth was successful
        } else {
          console.log('✅ User synced to users table successfully');
        }
      } catch (syncError) {
        console.warn('Error syncing user to users table:', syncError);
        // Don't throw error here as auth was successful
      }

      // Check if email confirmation is required
      if (authData.user && !authData.user.email_confirmed_at) {
        console.log('⚠️ Email confirmation required. User needs to check their email.');
        console.log('💡 If no email received, try disabling email confirmation in Supabase Dashboard');
        
        // Still return user data but indicate confirmation is needed
        const user: User = {
          id: authData.user.id,
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          role: userData.role,
          createdAt: authData.user.created_at || new Date().toISOString(),
          updatedAt: authData.user.updated_at || new Date().toISOString(),
        };
        
        console.log('✅ Registration successful (email confirmation required):', user);
        return user;
      }

      // Return user data from auth metadata
      const user: User = {
        id: authData.user.id,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role,
        createdAt: authData.user.created_at || new Date().toISOString(),
        updatedAt: authData.user.updated_at || new Date().toISOString(),
      };

      console.log('✅ Registration successful:', user);
      return user;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  async login(loginData: LoginData): Promise<User> {
    try {
      console.log('🔐 Starting login for:', loginData.email);
      
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: loginData.email,
        password: loginData.password,
      });

      console.log('Auth login result:', { authData, authError });

      if (authError) {
        console.error('Auth login error:', authError);
        
        // Provide more specific error messages
        if (authError.message.includes('Invalid login credentials')) {
          throw new Error('Invalid email or password. Please check your credentials and try again.');
        } else if (authError.message.includes('Email not confirmed')) {
          throw new Error('Please check your email and click the confirmation link before logging in. If no email received, try disabling email confirmation in Supabase Dashboard.');
        } else {
          throw new Error(authError.message);
        }
      }
      
      if (!authData.user) {
        throw new Error('Login failed - no user returned');
      }

      // Check if email is confirmed
      if (!authData.user.email_confirmed_at) {
        console.log('⚠️ User email not confirmed yet');
        console.log('💡 Try running this SQL in Supabase Dashboard:');
        console.log('UPDATE auth.users SET email_confirmed_at = NOW() WHERE email = \'' + loginData.email + '\';');
        throw new Error('Please check your email and click the confirmation link before logging in. If no email received, try disabling email confirmation in Supabase Dashboard.');
      }

      // Ensure user exists in users table for messaging
      try {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', authData.user.id)
          .single();

        if (userError || !userData) {
          console.log('User not found in users table, creating entry...');
          const { error: insertError } = await supabase
            .from('users')
            .insert({
              id: authData.user.id,
              email: authData.user.email,
              first_name: authData.user.user_metadata?.first_name || 'User',
              last_name: authData.user.user_metadata?.last_name || '',
              role: (authData.user.user_metadata?.role || 'client') as 'client' | 'freelancer' | 'admin',
              password_hash: 'synced_from_auth'
            });

          if (insertError) {
            console.warn('Failed to sync user to users table:', insertError);
          } else {
            console.log('✅ User synced to users table successfully');
          }
        }
      } catch (syncError) {
        console.warn('Error checking/syncing user in users table:', syncError);
      }

      // Return user data from auth metadata
      const user: User = {
        id: authData.user.id,
        email: authData.user.email || loginData.email,
        firstName: authData.user.user_metadata?.first_name || 'User',
        lastName: authData.user.user_metadata?.last_name || '',
        role: authData.user.user_metadata?.role || 'client',
        createdAt: authData.user.created_at || new Date().toISOString(),
        updatedAt: authData.user.updated_at || new Date().toISOString(),
      };

      console.log('✅ Login successful:', user);
      return user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  async resendConfirmationEmail(email: string): Promise<void> {
    try {
      console.log('📧 Resending confirmation email to:', email);
      
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });

      if (error) {
        console.error('Resend confirmation error:', error);
        throw new Error(error.message);
      }

      console.log('✅ Confirmation email resent successfully');
    } catch (error) {
      console.error('Resend confirmation error:', error);
      throw error;
    }
  },

  async confirmUserEmail(email: string): Promise<void> {
    try {
      console.log('🔧 Manually confirming email for:', email);
      
      // This is a workaround - you'll need to run this SQL in Supabase Dashboard
      console.log('💡 Run this SQL in Supabase Dashboard SQL Editor:');
      console.log(`UPDATE auth.users SET email_confirmed_at = NOW() WHERE email = '${email}';`);
      
      // Also provide alternative commands
      console.log('💡 Alternative - confirm all users:');
      console.log('UPDATE auth.users SET email_confirmed_at = NOW() WHERE email_confirmed_at IS NULL;');
      
      console.log('💡 To check current users:');
      console.log('SELECT id, email, email_confirmed_at FROM auth.users ORDER BY created_at DESC;');
      
      throw new Error(`Email confirmation requires manual SQL execution. 

Please run this SQL in your Supabase Dashboard:

UPDATE auth.users SET email_confirmed_at = NOW() WHERE email = '${email}';

Or to confirm all users:
UPDATE auth.users SET email_confirmed_at = NOW() WHERE email_confirmed_at IS NULL;

After running the SQL, try logging in again.`);
    } catch (error) {
      console.error('Confirm email error:', error);
      throw error;
    }
  },

  async checkUserStatus(email: string): Promise<void> {
    try {
      console.log('🔍 Checking user status for:', email);
      
      console.log('💡 Run this SQL in Supabase Dashboard to check user status:');
      console.log(`SELECT id, email, email_confirmed_at, created_at FROM auth.users WHERE email = '${email}';`);
      
      console.log('💡 To see all users:');
      console.log('SELECT id, email, email_confirmed_at, created_at FROM auth.users ORDER BY created_at DESC;');
      
      throw new Error(`User status check requires SQL execution.

Please run this SQL in your Supabase Dashboard:

SELECT id, email, email_confirmed_at, created_at FROM auth.users WHERE email = '${email}';

This will show you if your user exists and if email is confirmed.`);
    } catch (error) {
      console.error('Check user status error:', error);
      throw error;
    }
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      console.log('🔐 Getting current user...');
      
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
      
      console.log('Get user result:', { authUser, authError });
      
      if (authError) {
        if (authError.message === 'Auth session missing!') {
          console.log('No active auth session found');
        } else {
          console.error('Get user error:', authError);
        }
        return null;
      }
      
      if (!authUser) {
        console.log('No user found');
        return null;
      }

      // Ensure user exists in users table for messaging
      try {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', authUser.id)
          .single();

        if (userError || !userData) {
          console.log('User not found in users table, creating entry...');
          const { error: insertError } = await supabase
            .from('users')
            .insert({
              id: authUser.id,
              email: authUser.email,
              first_name: authUser.user_metadata?.first_name || 'User',
              last_name: authUser.user_metadata?.last_name || '',
              role: (authUser.user_metadata?.role || 'client') as 'client' | 'freelancer' | 'admin',
              password_hash: 'synced_from_auth'
            });

          if (insertError) {
            console.warn('Failed to sync user to users table:', insertError);
          } else {
            console.log('✅ User synced to users table successfully');
          }
        }
      } catch (syncError) {
        console.warn('Error checking/syncing user in users table:', syncError);
      }

      // Return user data from auth metadata
      const user: User = {
        id: authUser.id,
        email: authUser.email || '',
        firstName: authUser.user_metadata?.first_name || 'User',
        lastName: authUser.user_metadata?.last_name || '',
        role: authUser.user_metadata?.role || 'client',
        createdAt: authUser.created_at || new Date().toISOString(),
        updatedAt: authUser.updated_at || new Date().toISOString(),
      };

      console.log('✅ Current user:', user);
      return user;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  },

  async logout() {
    try {
      console.log('🔐 Logging out...');
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error);
        throw error;
      }
      console.log('✅ Logout successful');
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  },
}; 