import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, User, Eye, EyeOff, Users, Briefcase, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { AuthCarousel } from './AuthCarousel';

const registerSchema = z.object({
  firstName: z.string().min(1, 'First name is required').min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(1, 'Last name is required').min(2, 'Last name must be at least 2 characters'),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(1, 'Password is required').min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
  role: z.enum(['client', 'freelancer'], { required_error: 'Please select a role' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export const RegisterForm: React.FC = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur',
  });

  const selectedRole = watch('role');

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setErrorMessage('');
    console.log('[RegisterForm] Submitting registration:', data);
    try {
      const user = await registerUser({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        role: data.role,
      });
      console.log('[RegisterForm] Registration result:', user);
      if (user && user.id) {
      navigate('/dashboard');
      } else {
        console.error('[RegisterForm] Registration failed, no user returned');
        setErrorMessage('Registration failed. Please try again.');
      }
    } catch (error: any) {
      console.error('[RegisterForm] Registration error:', error);
      let msg = 'Registration failed. Please try again.';
      if (error) {
        if (typeof error === 'string') msg = error;
        else if (error.message) msg = error.message;
      }
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwitchToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-emerald-50 to-green-50 dark:from-slate-900 dark:via-emerald-900/20 dark:to-slate-900 px-4 py-8">
      <div className="w-full max-w-6xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-slate-700/50 flex flex-col md:flex-row overflow-hidden">
        {/* Left: Carousel */}
        <div className="hidden md:flex text-white w-full md:w-1/2 relative overflow-hidden">
          <AuthCarousel type="register" />
        </div>
        {/* Mobile: Simplified carousel */}
        <div className="md:hidden text-white w-full h-48 relative overflow-hidden">
          <AuthCarousel type="register" />
        </div>
        {/* Right: Register form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-10 lg:p-12 bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm">
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-600 to-green-700 dark:from-emerald-500 dark:to-green-600 rounded-2xl mb-6 shadow-lg">
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24" className="text-white">
                <path d="M12 2L2 7l10 5 10-5-10-5zm0 13.5l-10-5V17a2 2 0 002 2h16a2 2 0 002-2v-6.5l-10 5z" fill="currentColor"/>
              </svg>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-200 mb-2">Join FreelanceHub</h1>
            <p className="text-slate-600 dark:text-slate-400">Create your account to get started</p>
          </div>
          {errorMessage && (
            <div className="w-full mb-6 flex items-center bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl shadow-sm">
              <AlertCircle className="w-5 h-5 mr-3 text-red-500" />
              <span className="text-sm font-medium">{errorMessage}</span>
            </div>
          )}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                {...register('firstName')}
                type="text"
                label="First Name"
                placeholder="Enter your first name"
                icon={<User className="w-5 h-5 text-green-600" />}
                error={errors.firstName?.message}
              />
              <Input
                {...register('lastName')}
                type="text"
                label="Last Name"
                placeholder="Enter your last name"
                icon={<User className="w-5 h-5 text-green-600" />}
                error={errors.lastName?.message}
              />
            </div>
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
            <div className="relative">
              <Input
                {...register('confirmPassword')}
                type={showConfirmPassword ? 'text' : 'password'}
                label="Confirm Password"
                placeholder="Confirm your password"
                icon={<Lock className="w-5 h-5 text-green-600" />}
                error={errors.confirmPassword?.message}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-9 text-green-600 hover:text-green-400 transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-4">
                Choose your path:
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className={`relative flex items-center p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 group ${
                  selectedRole === 'client' 
                    ? 'border-emerald-500 bg-emerald-500/10 shadow-lg' 
                    : 'border-emerald-200 hover:border-emerald-500/50 hover:bg-emerald-100/50 dark:border-emerald-700 dark:hover:border-emerald-600 dark:hover:bg-emerald-800/50'
                }`}>
                  <input
                    {...register('role')}
                    type="radio"
                    value="client"
                    className="sr-only"
                  />
                  <Users className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mr-4 group-hover:scale-110 transition-transform" />
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Elite Client</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Access premium talent</p>
                  </div>
                  {selectedRole === 'client' && (
                    <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400 absolute top-2 right-2" />
                  )}
                </label>
                <label className={`relative flex items-center p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 group ${
                  selectedRole === 'freelancer' 
                    ? 'border-emerald-500 bg-emerald-500/10 shadow-lg' 
                    : 'border-emerald-200 hover:border-emerald-500/50 hover:bg-emerald-100/50 dark:border-emerald-700 dark:hover:border-emerald-600 dark:hover:bg-emerald-800/50'
                }`}>
                  <input
                    {...register('role')}
                    type="radio"
                    value="freelancer"
                    className="sr-only"
                  />
                  <Briefcase className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mr-4 group-hover:scale-110 transition-transform" />
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Pro Freelancer</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Showcase your expertise</p>
                  </div>
                  {selectedRole === 'freelancer' && (
                    <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400 absolute top-2 right-2" />
                  )}
                </label>
              </div>
              {errors.role && (
                <p className="mt-2 text-sm text-red-500 dark:text-red-400">{errors.role.message}</p>
              )}
            </div>
            <Button
              type="submit"
              loading={isLoading}
              className="w-full group bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 dark:from-emerald-500 dark:to-green-600 dark:hover:from-emerald-600 dark:hover:to-green-700 shadow-lg"
              size="lg"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <div className="text-center">
              <p className="text-slate-600 dark:text-slate-400">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={handleSwitchToLogin}
                  className="text-slate-800 dark:text-slate-200 hover:text-slate-600 dark:hover:text-slate-400 font-medium transition-colors"
                >
                  Sign in
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};