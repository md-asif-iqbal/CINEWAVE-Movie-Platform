'use client';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SearchBar({ value, onChange, onClear, placeholder = 'Search...', className }) {
  return (
    <div className={cn('relative w-full', className)}>
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-cw-text-secondary">
        <Search size={20} />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-cw-bg border-2 border-cw-border rounded-lg pl-10 pr-10 py-3 text-white placeholder:text-cw-text-secondary focus:outline-none focus:ring-2 focus:ring-cw-red/50 focus:border-cw-red transition-colors min-h-[44px]"
      />
      {value && (
        <button
          onClick={onClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-cw-text-secondary hover:text-white transition-colors min-w-[24px] min-h-[24px]"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
}
