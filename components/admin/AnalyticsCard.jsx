'use client';
import { cn } from '@/lib/utils';

export default function AnalyticsCard({ title, value, subtitle, icon: Icon, trend, className }) {
  return (
    <div className={cn('bg-cw-bg-secondary border border-cw-border rounded-lg p-4 md:p-6', className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-cw-text-secondary mb-1">{title}</p>
          <p className="text-2xl md:text-3xl font-heading font-bold text-white">{value}</p>
          {subtitle && <p className="text-xs text-cw-text-muted mt-1">{subtitle}</p>}
        </div>
        {Icon && (
          <div className="w-10 h-10 rounded-lg bg-cw-red/10 flex items-center justify-center shrink-0">
            <Icon size={20} className="text-cw-red" />
          </div>
        )}
      </div>
      {trend && (
        <div className="mt-3 flex items-center gap-1">
          <span className={cn('text-xs font-medium', trend > 0 ? 'text-green-400' : 'text-red-400')}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
          <span className="text-xs text-cw-text-secondary">from last month</span>
        </div>
      )}
    </div>
  );
}
