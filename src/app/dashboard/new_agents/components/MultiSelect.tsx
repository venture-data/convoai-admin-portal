import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, X, Check, Search } from 'lucide-react';

interface Option {
  id: string;
  label: string;
  description?: string;
}

interface MultiSelectProps {
  options: Option[];
  selectedValues: string[];
  onChange: (selectedIds: string[]) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  selectedValues,
  onChange,
  placeholder = 'Select options',
  className = '',
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleOption = (id: string) => {
    if (selectedValues.includes(id)) {
      onChange(selectedValues.filter(valueId => valueId !== id));
    } else {
      onChange([...selectedValues, id]);
    }
  };

  const removeOption = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(selectedValues.filter(valueId => valueId !== id));
  };

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (option.description && option.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
    >
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`flex flex-wrap min-h-[42px] gap-2 p-2 rounded-md border ${
          isOpen ? 'border-orange-500/50' : 'border-white/10'
        } bg-[#1A1D25]/70 ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        }`}
      >
        {selectedValues.length === 0 ? (
          <div className="text-white/40 py-1 px-2">{placeholder}</div>
        ) : (
          <>
            {selectedValues.map(id => {
              const option = options.find(o => o.id === id);
              if (!option) return null;
              
              return (
                <div
                  key={id}
                  className="flex items-center gap-1 bg-orange-500/20 text-white/90 text-sm rounded-md py-1 px-2"
                >
                  {option.label}
                  <button
                    onClick={e => removeOption(id, e)}
                    className="text-white/70 hover:text-white ml-1 focus:outline-none"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              );
            })}
          </>
        )}
        
        <div className="ml-auto self-center">
          <ChevronDown 
            className={`h-4 w-4 text-white/50 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} 
          />
        </div>
      </div>
      
      {isOpen && (
        <div className="absolute mt-1 z-50 w-full max-h-64 overflow-auto rounded-md py-1 bg-[#1A1D25] border border-white/10 shadow-lg">
          <div className="sticky top-0 bg-[#1A1D25] p-2 border-b border-white/10">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search..."
                className="w-full py-1.5 pl-8 pr-2 text-sm text-white bg-[#181B22] border border-white/10 rounded-md focus:border-orange-500/50 focus:outline-none"
              />
              <Search className="absolute left-2 top-2 h-4 w-4 text-white/40" />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2 top-2 text-white/40 hover:text-white"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
          
          {filteredOptions.length === 0 ? (
            <div className="px-4 py-3 text-center text-white/40 text-sm">
              No options found
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {filteredOptions.map(option => (
                <div
                  key={option.id}
                  onClick={() => toggleOption(option.id)}
                  className="px-3 py-2 flex items-start gap-2 hover:bg-white/5 cursor-pointer"
                >
                  <div className="mt-0.5 flex-shrink-0 h-4 w-4 rounded border border-white/20 flex items-center justify-center">
                    {selectedValues.includes(option.id) && (
                      <Check className="h-3 w-3 text-orange-500" />
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">
                      {option.label}
                    </div>
                    {option.description && (
                      <div className="text-xs text-white/50 mt-0.5">
                        {option.description}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}; 