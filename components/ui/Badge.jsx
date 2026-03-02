'use client';
import { cn } from '@/lib/utils';

export default function Badge({ children, variant = 'default', className }) {
  const variants = {
    default: 'bg-cw-bg-card text-white',
    red: 'bg-cw-red text-white',
    green: 'bg-green-600 text-white',
    yellow: 'bg-yellow-600 text-white',
    outline: 'border border-cw-border text-cw-text-muted',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
