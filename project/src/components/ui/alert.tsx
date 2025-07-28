import React from 'react';
import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react';

interface AlertProps {
  children: React.ReactNode;
  variant?: 'default' | 'destructive' | 'success' | 'warning';
  className?: string;
}

interface AlertDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

const alertVariants = {
  default: 'bg-dark-800 border-green-500/30 text-white',
  destructive: 'bg-red-500/20 border-red-500/30 text-red-400',
  success: 'bg-green-500/20 border-green-500/30 text-green-400',
  warning: 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400'
};

const alertIcons = {
  default: Info,
  destructive: XCircle,
  success: CheckCircle,
  warning: AlertTriangle
};

export const Alert: React.FC<AlertProps> = ({ 
  children, 
  variant = 'default', 
  className = '' 
}) => {
  const Icon = alertIcons[variant];
  
  return (
    <div className={`flex items-start p-4 border rounded-lg ${alertVariants[variant]} ${className}`}>
      <Icon className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
};

export const AlertDescription: React.FC<AlertDescriptionProps> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div className={`text-sm ${className}`}>
      {children}
    </div>
  );
}; 