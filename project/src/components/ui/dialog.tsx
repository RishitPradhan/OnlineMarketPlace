import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

interface DialogContentProps {
  children: React.ReactNode;
  className?: string;
}

interface DialogHeaderProps {
  children: React.ReactNode;
}

interface DialogTitleProps {
  children: React.ReactNode;
}

interface DialogTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
}

export const Dialog: React.FC<DialogProps> = ({ open, onOpenChange, children }) => {
  const [isOpen, setIsOpen] = useState(open || false);

  useEffect(() => {
    setIsOpen(open || false);
  }, [open]);

  const handleOpenChange = (newOpen: boolean) => {
    setIsOpen(newOpen);
    onOpenChange?.(newOpen);
  };

  return (
    <div>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          if (child.type === DialogTrigger) {
            return React.cloneElement(child, {
              onClick: () => handleOpenChange(true)
            });
          }
          if (child.type === DialogContent) {
            return isOpen ? React.cloneElement(child, {
              onClose: () => handleOpenChange(false)
            }) : null;
          }
        }
        return child;
      })}
    </div>
  );
};

export const DialogContent: React.FC<DialogContentProps & { onClose?: () => void }> = ({ 
  children, 
  className = '',
  onClose 
}) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose?.();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className={`relative bg-dark-900 border border-green-500/30 rounded-lg shadow-xl max-w-md w-full mx-4 ${className}`}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-green-400 hover:text-green-300 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        {children}
      </div>
    </div>
  );
};

export const DialogHeader: React.FC<DialogHeaderProps> = ({ children }) => {
  return (
    <div className="px-6 py-4 border-b border-green-500/20">
      {children}
    </div>
  );
};

export const DialogTitle: React.FC<DialogTitleProps> = ({ children }) => {
  return (
    <h2 className="text-xl font-semibold text-white">
      {children}
    </h2>
  );
};

export const DialogTrigger: React.FC<DialogTriggerProps & { onClick?: () => void }> = ({ 
  children, 
  asChild = false,
  onClick 
}) => {
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, { onClick });
  }
  
  return (
    <button onClick={onClick} className="inline-flex items-center justify-center">
      {children}
    </button>
  );
}; 