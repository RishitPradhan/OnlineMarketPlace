import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-900 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-neon-green-glow dark:bg-neon-green-glow bg-green-500 text-white dark:text-white text-white hover:shadow-neon-green-glow-lg dark:hover:shadow-neon-green-glow-lg hover:shadow-green-500-lg shadow-neon-green-glow dark:shadow-neon-green-glow shadow-green-500 font-semibold transform hover:scale-105 active:scale-95',
    secondary: 'bg-dark-800 dark:bg-dark-800 bg-green-100 text-white dark:text-white text-gray-900 border border-dark-600 dark:border-dark-600 border-green-300 hover:bg-dark-700 dark:hover:bg-dark-700 hover:bg-green-200 hover:border-green-500/50 dark:hover:border-green-500/50 hover:border-green-500/50 focus:ring-green-500 dark:focus:ring-green-500 focus:ring-green-500',
    outline: 'border-2 border-green-500 dark:border-green-500 border-green-500 text-green-400 dark:text-green-400 text-green-600 hover:bg-green-500/10 dark:hover:bg-green-500/10 hover:bg-green-500/10 hover:text-green-300 dark:hover:text-green-300 hover:text-green-700 focus:ring-green-500 dark:focus:ring-green-500 focus:ring-green-500 hover:shadow-neon-green-glow dark:hover:shadow-neon-green-glow hover:shadow-green-500',
    ghost: 'text-dark-300 dark:text-dark-300 text-gray-600 hover:text-white dark:hover:text-white hover:text-gray-900 hover:bg-dark-800/50 dark:hover:bg-dark-800/50 hover:bg-green-100/50 focus:ring-green-500 dark:focus:ring-green-500 focus:ring-green-500',
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={classes}
    >
      {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {children}
    </button>
  );
};