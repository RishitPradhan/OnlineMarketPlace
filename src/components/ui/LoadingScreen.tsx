import React from 'react';

interface LoadingScreenProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  message = "Loading your elite workspace...", 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950 flex items-center justify-center relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-green-500/10 rounded-full animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-blue-500/10 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-20 h-20 bg-purple-500/10 rounded-full animate-pulse delay-500"></div>
        <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-yellow-500/10 rounded-full animate-pulse delay-1500"></div>
      </div>

      {/* Main loading container */}
      <div className="relative z-10 text-center">
        {/* Logo/Brand section */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-2xl mb-4 animate-pulse">
            <span className="text-3xl font-bold text-white">F</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">FreelanceHub</h1>
          <p className="text-green-400 text-sm">Elite Freelancing Platform</p>
        </div>

        {/* Animated loading spinner */}
        <div className="relative mb-6">
          <div className={`${sizeClasses[size]} border-4 border-green-500/20 rounded-full animate-spin`}>
            <div className="absolute inset-0 border-4 border-transparent border-t-green-500 rounded-full animate-spin"></div>
          </div>
          
          {/* Pulsing ring */}
          <div className={`absolute inset-0 ${sizeClasses[size]} border-2 border-green-500/30 rounded-full animate-ping`}></div>
          
          {/* Inner glow */}
          <div className={`absolute inset-2 ${sizeClasses[size]} bg-green-500/20 rounded-full animate-pulse`}></div>
        </div>

        {/* Loading message with typing animation */}
        <div className="mb-4">
          <p className="text-green-400 text-lg font-medium">
            {message}
            <span className="inline-block w-1 h-5 bg-green-400 ml-1 animate-pulse"></span>
          </p>
        </div>

        {/* Progress dots */}
        <div className="flex justify-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce delay-100"></div>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce delay-200"></div>
        </div>

        {/* Status indicators */}
        <div className="mt-8 flex justify-center space-x-4 text-xs text-green-400/60">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
            <span>Initializing</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse delay-300"></div>
            <span>Loading</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse delay-600"></div>
            <span>Ready</span>
          </div>
        </div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-green-400/40 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          ></div>
        ))}
      </div>
    </div>
  );
}; 