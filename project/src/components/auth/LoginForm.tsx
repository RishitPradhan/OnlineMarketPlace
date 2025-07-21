import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(1, 'Password is required').min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      await login(data.email, data.password);
      navigate('/dashboard');
    } catch (error: any) {
      setErrorMessage(error.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwitchToRegister = () => {
    navigate('/register');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-green-50 dark:from-dark-950 dark:to-dark-900 px-0 py-0">
      <div className="w-full max-w-4xl bg-white dark:bg-dark-900 rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden">
        {/* Left: Welcome message */}
        <div className="hidden md:flex flex-col justify-center items-center bg-green-600 dark:bg-green-800 text-white w-full md:w-1/2 p-10 transition-all duration-500">
          <div className="h-32 flex flex-col items-center justify-center w-full">
            <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold text-white text-center transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>Welcome to FreelanceHub</h1>
            <p className={`mt-8 text-xl md:text-2xl text-white/90 text-center max-w-xl transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>Unlock your potential. Connect. Create. Succeed.</p>
          </div>
        </div>
        {/* Right: Login form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-12">
          <div className="mb-8 text-center">
            <span className="inline-block w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-2">
              <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zm0 13.5l-10-5V17a2 2 0 002 2h16a2 2 0 002-2v-6.5l-10 5z" fill="#10b981"/></svg>
            </span>
            <h1 className="text-2xl font-bold text-green-700 dark:text-green-400">Sign in to FreelanceHub</h1>
          </div>
          {errorMessage && (
            <div className="w-full mb-4 flex items-center bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg">
              <AlertCircle className="w-5 h-5 mr-2 text-red-500" />
              <span className="text-sm font-medium">{errorMessage}</span>
            </div>
          )}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full">
            <Input
              {...register('email')}
              type="email"
              label="Email"
              placeholder="Enter your email"
              icon={<Mail className="w-5 h-5 text-dark-400 dark:text-dark-400 text-green-600" />}
              error={errors.email?.message}
            />
            <div className="relative">
              <Input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                label="Password"
                placeholder="Enter your password"
                icon={<Lock className="w-5 h-5 text-dark-400 dark:text-dark-400 text-green-600" />}
                error={errors.password?.message}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-dark-400 dark:text-dark-400 text-green-600 hover:text-green-400 dark:hover:text-green-400 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <Button
              type="submit"
              loading={isLoading}
              className="w-full group"
              size="lg"
            >
              {isLoading ? 'Signing In...' : 'Access Dashboard'}
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <div className="text-center">
              <p className="text-dark-300 dark:text-dark-300 text-green-600">
                New to FreelanceHub?{' '}
                <button
                  type="button"
                  onClick={handleSwitchToRegister}
                  className="text-green-600 hover:text-green-500 font-medium transition-colors"
                >
                  Join the elite
                </button>
              </p>
            </div>
            {/* Test credentials for development */}
            <div className="mt-6 p-4 bg-dark-800/50 dark:bg-dark-800/50 bg-green-100/50 rounded-lg border border-dark-600 dark:border-dark-600 border-green-200">
              <p className="text-xs text-dark-400 dark:text-dark-400 text-green-600 mb-2">For testing purposes:</p>
              <p className="text-xs text-dark-300 dark:text-dark-300 text-green-600">Email: test@example.com</p>
              <p className="text-xs text-dark-300 dark:text-dark-300 text-green-600">Password: password123</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Add fade-in-out animation for the slideshow
// In your global CSS (e.g., index.css), add:
// .animate-fade-in-out { animation: fadeInOut 1s; }
// @keyframes fadeInOut { 0% { opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { opacity: 0; } }