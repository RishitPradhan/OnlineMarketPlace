import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-dark-200 dark:text-dark-200 text-gray-900 mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            {...props}
            className={`
              block w-full px-4 py-3 bg-dark-800/50 dark:bg-dark-800/50 bg-white border border-dark-600 dark:border-dark-600 border-green-300 rounded-lg shadow-sm
              focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-500 focus:ring-green-500 focus:border-green-500 dark:focus:border-green-500 focus:border-green-500
              transition-all duration-300 text-white dark:text-white text-gray-900 placeholder-dark-400 dark:placeholder-dark-400 placeholder-gray-500
              hover:border-green-500/50 dark:hover:border-green-500/50 hover:border-green-500/50 hover:bg-dark-800/70 dark:hover:bg-dark-800/70 hover:bg-white/80
              ${icon ? 'pl-11' : ''}
              ${error ? 'border-red-500 dark:border-red-500 focus:ring-red-500 dark:focus:ring-red-500 focus:border-red-500' : ''}
              ${className}
            `}
          />
        </div>
        {error && (
          <p className="mt-2 text-sm text-red-400 dark:text-red-400 text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';