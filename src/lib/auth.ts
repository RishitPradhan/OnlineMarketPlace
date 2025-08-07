import { supabase } from './supabase';
import { User, RegisterData, LoginData } from '../types';

export const authService = {
  async register(userData: RegisterData): Promise<User> {
    try {
      // First, sign up with Supabase Auth
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

      if (authError) {
        console.error('Auth signup error:', authError);
        throw new Error(authError.message);
      }
      
      if (!authData.user) {
        throw new Error('Registration failed - no user returned');
      }

      // Try to create user profile in our custom table, but don't fail if it doesn't work
      try {
        const { data: profileData, error: profileError } = await supabase
          .from('users')
          .insert([{
            id: authData.user.id,
            email: userData.email,
            first_name: userData.firstName,
            last_name: userData.lastName,
            role: userData.role,
            password_hash: 'managed_by_supabase', // Placeholder since Supabase handles passwords
          }])
          .select()
          .single();

        if (!profileError && profileData) {
          return this.mapUserFromDb(profileData);
        }
      } catch (error) {
        console.error('Profile creation error (non-blocking):', error);
      }

      // Always return user data from auth, even if profile creation fails
      return {
        id: authData.user.id,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role,
        createdAt: authData.user.created_at || new Date().toISOString(),
        updatedAt: authData.user.updated_at || new Date().toISOString(),
      };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  async login(loginData: LoginData): Promise<User> {
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: loginData.email,
        password: loginData.password,
      });

      if (authError) {
        console.error('Auth login error:', authError);
        throw new Error(authError.message);
      }
      
      if (!authData.user) {
        throw new Error('Login failed - no user returned');
      }

      // Try to get user profile from our custom table, but don't fail if it doesn't exist
      try {
        const { data: profileData, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', authData.user.id)
          .single();

        if (!profileError && profileData) {
          return this.mapUserFromDb(profileData);
        }
      } catch (error) {
        console.error('Profile fetch error (non-blocking):', error);
      }

      // Always return user data from auth, even if profile doesn't exist
      return {
        id: authData.user.id,
        email: authData.user.email || loginData.email,
        firstName: authData.user.user_metadata?.first_name || 'User',
        lastName: authData.user.user_metadata?.last_name || '',
        role: authData.user.user_metadata?.role || 'client',
        createdAt: authData.user.created_at || new Date().toISOString(),
        updatedAt: authData.user.updated_at || new Date().toISOString(),
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        // Handle expected "Auth session missing!" as info rather than error
        if (authError.message === 'Auth session missing!') {
          console.debug('No active auth session found');
        } else {
          console.error('Get user error:', authError);
        }
        return null;
      }
      
      if (!authUser) {
        return null;
      }

      // Try to get user profile from our custom table, but don't fail if it doesn't exist
      try {
        const { data: profileData, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', authUser.id)
          .single();

        if (!profileError && profileData) {
          return this.mapUserFromDb(profileData);
        }
      } catch (error) {
        console.error('Profile fetch error (non-blocking):', error);
      }

      // Always return user data from auth, even if profile doesn't exist
      return {
        id: authUser.id,
        email: authUser.email || '',
        firstName: authUser.user_metadata?.first_name || 'User',
        lastName: authUser.user_metadata?.last_name || '',
        role: authUser.user_metadata?.role || 'client',
        createdAt: authUser.created_at || new Date().toISOString(),
        updatedAt: authUser.updated_at || new Date().toISOString(),
      };
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  },

  mapUserFromDb(data: any): User {
    return {
      id: data.id,
      email: data.email,
      firstName: data.first_name,
      lastName: data.last_name,
      role: data.role,
      avatar: data.avatar,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  },

  async logout() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error);
        throw error;
      }
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  },
};