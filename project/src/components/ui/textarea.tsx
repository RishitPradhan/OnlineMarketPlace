import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
}

export const Textarea: React.FC<TextareaProps> = ({ 
  className = '', 
  ...props 
}) => {
  return (
    <textarea
      className={`w-full px-3 py-2 bg-dark-800 border border-green-500/30 rounded-lg text-white placeholder-green-400/60 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-vertical min-h-[100px] ${className}`}
      {...props}
    />
  );
}; 