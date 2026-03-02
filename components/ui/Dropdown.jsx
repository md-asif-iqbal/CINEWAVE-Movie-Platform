'use client';
import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Dropdown({ trigger, children, className, align = 'left' }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 min-h-[44px] min-w-[44px]"
      >
        {trigger}
        <ChevronDown
          size={16}
          className={cn('transition-transform text-cw-text-secondary', isOpen && 'rotate-180')}
        />
      </button>
      {isOpen && (
        <div
          className={cn(
            'absolute top-full mt-2 bg-cw-bg-secondary border border-cw-border rounded-lg shadow-xl py-2 min-w-[180px] z-50',
            align === 'right' ? 'right-0' : 'left-0',
            className
          )}
          onClick={() => setIsOpen(false)}
        >
          {children}
        </div>
      )}
    </div>
  );
}

export function DropdownItem({ children, onClick, className, danger }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full text-left px-4 py-2.5 text-sm hover:bg-white/10 transition-colors min-h-[44px]',
        danger ? 'text-red-400 hover:text-red-300' : 'text-white',
        className
      )}
    >
      {children}
    </button>
  );
}
