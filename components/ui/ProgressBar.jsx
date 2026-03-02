'use client';
import { cn } from '@/lib/utils';

export default function ProgressBar({ value = 0, max = 100, className, color = 'red' }) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const colors = {
    red: 'bg-cw-red',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    blue: 'bg-blue-500',
  };

  return (
    <div className={cn('w-full bg-cw-bg-card rounded-full h-1.5', className)}>
      <div
        className={cn('h-full rounded-full transition-all duration-300', colors[color])}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
