import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'outline' | 'solid';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'solid',
  size = 'md',
  className = '',
  ...props
}) => {
  const base = 'inline-flex items-center justify-center rounded px-4 py-2 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  const variants: Record<string, string> = {
    solid: 'bg-green-600 text-white hover:bg-green-700',
    outline: 'border border-green-600 text-green-600 bg-transparent hover:bg-green-50',
  };
  const sizes: Record<string, string> = {
    sm: 'text-sm h-8',
    md: 'text-base h-10',
    lg: 'text-lg h-12',
  };
  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;