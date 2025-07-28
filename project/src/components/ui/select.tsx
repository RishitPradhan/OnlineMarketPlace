import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  placeholder?: string;
  disabled?: boolean;
}

interface SelectContentProps {
  children: React.ReactNode;
}

interface SelectItemProps {
  value: string;
  children: React.ReactNode;
  onSelect?: () => void;
}

interface SelectTriggerProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

interface SelectValueProps {
  placeholder?: string;
}

export const Select: React.FC<SelectProps> = ({ value, onValueChange, children, placeholder, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value || '');
  const [selectedLabel, setSelectedLabel] = useState('');
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (value: string, label: string) => {
    setSelectedValue(value);
    setSelectedLabel(label);
    setIsOpen(false);
    onValueChange?.(value);
  };

  return (
    <div ref={selectRef} className="relative">
      <SelectTrigger 
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full px-3 py-2 bg-dark-800 border border-green-500/30 rounded-lg text-white placeholder-green-400/60 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <span className={selectedValue ? 'text-white' : 'text-green-400/60'}>
          {selectedLabel || placeholder || 'Select an option'}
        </span>
        <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </SelectTrigger>
      
      {isOpen && (
        <SelectContent>
          {React.Children.map(children, (child) => {
            if (React.isValidElement(child) && child.type === SelectItem) {
              return (
                <div
                  key={child.props.value}
                  className="px-3 py-2 text-white hover:bg-green-500/20 cursor-pointer transition-colors"
                  onClick={() => handleSelect(child.props.value, child.props.children)}
                >
                  {child.props.children}
                </div>
              );
            }
            return child;
          })}
        </SelectContent>
      )}
    </div>
  );
};

export const SelectContent: React.FC<SelectContentProps> = ({ children }) => {
  return (
    <div className="absolute z-50 w-full mt-1 bg-dark-800 border border-green-500/30 rounded-lg shadow-lg max-h-60 overflow-auto">
      {children}
    </div>
  );
};

export const SelectItem: React.FC<SelectItemProps & { onSelect?: () => void }> = ({ value, children, onSelect }) => {
  return (
    <div
      className="px-3 py-2 text-white hover:bg-green-500/20 cursor-pointer transition-colors"
      onClick={onSelect}
    >
      {children}
    </div>
  );
};

export const SelectTrigger: React.FC<SelectTriggerProps> = ({ children, className }) => {
  return (
    <div className={`flex items-center justify-between ${className}`}>
      {children}
    </div>
  );
};

export const SelectValue: React.FC<SelectValueProps> = ({ placeholder }) => {
  return <span className="text-green-400/60">{placeholder}</span>;
}; 