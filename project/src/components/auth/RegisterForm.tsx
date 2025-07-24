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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-green-50 dark:from-dark-950 dark:to-dark-900 px-0 py-0">
      <div className="w-full max-w-4xl bg-white dark:bg-dark-900 rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden">
        {/* Left: Welcome message */}
        <div className="hidden md:flex flex-col justify-center items-center bg-green-600 dark:bg-green-800 text-white w-full md:w-1/2 p-10 transition-all duration-500">
          <div className="h-32 flex flex-col items-center justify-center w-full">
            <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold text-white text-center transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>Welcome to FreelanceHub</h1>
            <p className={`mt-8 text-xl md:text-2xl text-white/90 text-center max-w-xl transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>Unlock your potential. Connect. Create. Succeed.</p>
          </div>
        </div>
        {/* Right: Register form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-12">
          <div className="mb-8 text-center">
            <span className="inline-block w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-2">
              <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zm0 13.5l-10-5V17a2 2 0 002 2h16a2 2 0 002-2v-6.5l-10 5z" fill="#10b981"/></svg>
            </span>
            <h1 className="text-2xl font-bold text-green-700 dark:text-green-400">Create your account</h1>
          </div>
          {errorMessage && (
            <div className="w-full mb-4 flex items-center bg-red-200 border border-red-400 text-red-800 px-4 py-3 rounded-lg shadow-lg animate-pulse">
              <AlertCircle className="w-5 h-5 mr-2 text-red-600" />
              <span className="text-base font-semibold">{errorMessage}</span>
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
              <label className="block text-sm font-medium text-green-800 mb-4">
                Choose your path:
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className={`relative flex items-center p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 group ${
                  selectedRole === 'client' 
                    ? 'border-green-500 bg-green-500/10 shadow-lg' 
                    : 'border-green-200 hover:border-green-500/50 hover:bg-green-100/50'
                }`}>
                  <input
                    {...register('role')}
                    type="radio"
                    value="client"
                    className="sr-only"
                  />
                  <Users className="w-8 h-8 text-green-600 mr-4 group-hover:scale-110 transition-transform" />
                  <div>
                    <p className="font-semibold text-green-800 mb-1">Elite Client</p>
                    <p className="text-sm text-green-600">Access premium talent</p>
                  </div>
                  {selectedRole === 'client' && (
                    <Sparkles className="w-5 h-5 text-green-600 absolute top-2 right-2" />
                  )}
                </label>
                <label className={`relative flex items-center p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 group ${
                  selectedRole === 'freelancer' 
                    ? 'border-green-500 bg-green-500/10 shadow-lg' 
                    : 'border-green-200 hover:border-green-500/50 hover:bg-green-100/50'
                }`}>
                  <input
                    {...register('role')}
                    type="radio"
                    value="freelancer"
                    className="sr-only"
                  />
                  <Briefcase className="w-8 h-8 text-green-600 mr-4 group-hover:scale-110 transition-transform" />
                  <div>
                    <p className="font-semibold text-green-800 mb-1">Pro Freelancer</p>
                    <p className="text-sm text-green-600">Showcase your expertise</p>
                  </div>
                  {selectedRole === 'freelancer' && (
                    <Sparkles className="w-5 h-5 text-green-600 absolute top-2 right-2" />
                  )}
                </label>
              </div>
              {errors.role && (
                <p className="mt-2 text-sm text-red-400 dark:text-red-400 text-red-600">{errors.role.message}</p>
              )}
            </div>
            <Button
              type="submit"
              loading={isLoading}
              className="w-full group"
              size="lg"
            >
              {isLoading ? 'Registering...' : 'Create Account'}
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <div className="text-center">
              <p className="text-green-600">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={handleSwitchToLogin}
                  className="text-green-600 hover:text-green-500 font-medium transition-colors"
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