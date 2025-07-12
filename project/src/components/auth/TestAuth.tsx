import React, { useState } from 'react';
import { simpleAuthService } from '../../lib/simple-auth';

export const TestAuth: React.FC = () => {
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('password123');
  const [firstName, setFirstName] = useState('Test');
  const [lastName, setLastName] = useState('User');
  const [role, setRole] = useState<'client' | 'freelancer'>('client');
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testRegister = async () => {
    setLoading(true);
    setResult('Testing registration...');
    
    try {
      const user = await simpleAuthService.register({
        email,
        password,
        firstName,
        lastName,
        role,
      });
      
      setResult(`✅ Registration successful! User ID: ${user.id}\n\n⚠️ IMPORTANT: Check your email for a confirmation link. You must confirm your email before you can log in.`);
    } catch (error: any) {
      setResult(`❌ Registration failed: ${error.message}`);
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  const testLogin = async () => {
    setLoading(true);
    setResult('Testing login...');
    
    try {
      const user = await simpleAuthService.login({
        email,
        password,
      });
      
      setResult(`✅ Login successful! Welcome ${user.firstName} ${user.lastName}`);
    } catch (error: any) {
      setResult(`❌ Login failed: ${error.message}\n\n💡 If you just registered, make sure to:\n1. Check your email for a confirmation link\n2. Click the confirmation link\n3. Try logging in again`);
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const testGetCurrentUser = async () => {
    setLoading(true);
    setResult('Testing get current user...');
    
    try {
      const user = await simpleAuthService.getCurrentUser();
      
      if (user) {
        setResult(`✅ Current user: ${user.email} (${user.id})`);
      } else {
        setResult('❌ No current user found');
      }
    } catch (error: any) {
      setResult(`❌ Get current user failed: ${error.message}`);
      console.error('Get current user error:', error);
    } finally {
      setLoading(false);
    }
  };

  const resendConfirmation = async () => {
    setLoading(true);
    setResult('Resending confirmation email...');
    
    try {
      await simpleAuthService.resendConfirmationEmail(email);
      setResult('📧 Confirmation email resent! Check your inbox.');
    } catch (error: any) {
      setResult(`❌ Failed to resend confirmation: ${error.message}`);
      console.error('Resend confirmation error:', error);
    } finally {
      setLoading(false);
    }
  };

  const confirmEmailManually = async () => {
    setLoading(true);
    setResult('Getting SQL command for manual confirmation...');
    
    try {
      await simpleAuthService.confirmUserEmail(email);
      setResult('🔧 Check the console for the SQL command to run in Supabase Dashboard.');
    } catch (error: any) {
      setResult(`❌ Manual confirmation failed: ${error.message}`);
      console.error('Manual confirmation error:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkUserStatus = async () => {
    setLoading(true);
    setResult('Checking user status...');
    
    try {
      await simpleAuthService.checkUserStatus(email);
      setResult('🔍 Check the console for SQL commands to check user status in Supabase Dashboard.');
    } catch (error: any) {
      setResult(`❌ User status check failed: ${error.message}`);
      console.error('User status check error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 to-dark-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-dark-800 rounded-xl p-6 shadow-2xl">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">Auth Test</h1>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-green-400 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-dark-700 border border-green-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-green-400 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-dark-700 border border-green-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-green-400 mb-1">First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-3 py-2 bg-dark-700 border border-green-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-green-400 mb-1">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-3 py-2 bg-dark-700 border border-green-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-green-400 mb-1">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as 'client' | 'freelancer')}
              className="w-full px-3 py-2 bg-dark-700 border border-green-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="client">Client</option>
              <option value="freelancer">Freelancer</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <button
              onClick={testRegister}
              disabled={loading}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Testing...' : 'Test Register'}
            </button>
            
            <button
              onClick={testLogin}
              disabled={loading}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Testing...' : 'Test Login'}
            </button>
            
            <button
              onClick={testGetCurrentUser}
              disabled={loading}
              className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Testing...' : 'Test Get Current User'}
            </button>
            
            <button
              onClick={resendConfirmation}
              disabled={loading}
              className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Resend Confirmation Email'}
            </button>
            
            <button
              onClick={confirmEmailManually}
              disabled={loading}
              className="w-full px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Manual Email Confirmation'}
            </button>
            
            <button
              onClick={checkUserStatus}
              disabled={loading}
              className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Checking...' : 'Check User Status'}
            </button>
          </div>
          
          {result && (
            <div className="mt-4 p-3 bg-dark-700 rounded-lg">
              <p className="text-sm text-white whitespace-pre-wrap">{result}</p>
            </div>
          )}
          
          <div className="mt-4 p-3 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
            <h3 className="font-semibold text-yellow-400 mb-2">Important Notes:</h3>
            <ul className="text-xs text-yellow-300 space-y-1">
              <li>• Registration creates a user account in Supabase Auth</li>
              <li>• Email confirmation is required before login</li>
              <li>• Check your email for a confirmation link after registration</li>
              <li>• If you don't see the email, check spam folder or use "Resend Confirmation Email"</li>
              <li>• Only confirmed users can log in successfully</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}; 