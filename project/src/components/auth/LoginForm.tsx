import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { AuthCarousel } from './AuthCarousel';

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
      const user = await login(data.email, data.password);
      if (user && user.id) {
        navigate('/dashboard');
      } else {
        setErrorMessage('Login failed. Please check your credentials.');
      }
    } catch (error: any) {
      let msg = 'Login failed. Please check your credentials.';
      if (error) {
        if (typeof error === 'string') msg = error;
        else if (error.message) msg = error.message;
      }
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwitchToRegister = () => {
    navigate('/register');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-emerald-50 to-green-50 dark:from-slate-900 dark:via-emerald-900/20 dark:to-slate-900 px-4 py-8">
      <div className="w-full max-w-6xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-slate-700/50 flex flex-col md:flex-row overflow-hidden">
        
        {/* Left: Carousel - Fixed positioning */}
        <div className="hidden md:flex w-full md:w-1/2 relative overflow-hidden rounded-l-3xl">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900">
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.3)_1px,transparent_1px)] bg-[length:24px_24px]"></div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-green-500/10"></div>
            
            {/* Carousel Content - Full height */}
            <div className="absolute inset-0">
              <AuthCarousel type="login" />
            </div>
          </div>
        </div>
        
        {/* Mobile: Simplified carousel */}
        <div className="md:hidden w-full h-48 relative overflow-hidden rounded-t-3xl">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900">
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.3)_1px,transparent_1px)] bg-[length:24px_24px]"></div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-green-500/10"></div>
            
            {/* Mobile Carousel */}
            <div className="absolute inset-0">
              <AuthCarousel type="login" />
            </div>
          </div>
        </div>
        
        {/* Right: Login form - Clean and separate */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-10 lg:p-12 bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm relative z-10">
          <div className="w-full max-w-md">
            <div className="mb-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-600 to-green-700 dark:from-emerald-500 dark:to-green-600 rounded-2xl mb-6 shadow-lg">
                <svg width="28" height="28" fill="none" viewBox="0 0 24 24" className="text-white">
                  <path d="M12 2L2 7l10 5 10-5-10-5zm0 13.5l-10-5V17a2 2 0 002 2h16a2 2 0 002-2v-6.5l-10 5z" fill="currentColor"/>
                </svg>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-200 mb-2">Welcome back</h1>
              <p className="text-slate-600 dark:text-slate-400">Sign in to your account</p>
            </div>
            
            {errorMessage && (
              <div className="w-full mb-6 flex items-center bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl shadow-sm">
                <AlertCircle className="w-5 h-5 mr-3 text-red-500" />
                <span className="text-sm font-medium">{errorMessage}</span>
              </div>
            )}
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full">
              <Input
                {...register('email')}
                type="email"
                label="Email"
                placeholder="Enter your email"
                icon={<Mail className="w-5 h-5 text-green-600" />}
                error={errors.email?.message}
              />
              
              <div className="relative">
                <Input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  label="Password"
                  placeholder="Enter your password"
                  icon={<Lock className="w-5 h-5 text-green-600" />}
                  error={errors.password?.message}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 text-green-600 hover:text-green-400 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              
              <Button
                type="submit"
                loading={isLoading}
                className="w-full group bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 dark:from-emerald-500 dark:to-green-600 dark:hover:from-emerald-600 dark:hover:to-green-700 shadow-lg"
                size="lg"
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <div className="text-center">
                <p className="text-slate-600 dark:text-slate-400">
                  New to FreelanceHub?{' '}
                  <button
                    type="button"
                    onClick={handleSwitchToRegister}
                    className="text-slate-800 dark:text-slate-200 hover:text-slate-600 dark:hover:text-slate-400 font-medium transition-colors"
                  >
                    Create account
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};