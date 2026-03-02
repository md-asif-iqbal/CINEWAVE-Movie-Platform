'use client';
import { cn } from '@/lib/utils';

export default function Tooltip({ children, text, className }) {
  return (
    <div className="relative group">
      {children}
      <div
        className={cn(
          'absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-cw-bg-card text-white text-xs rounded whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50',
          className
        )}
      >
        {text}
        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-cw-bg-card" />
      </div>
    </div>
  );
}
