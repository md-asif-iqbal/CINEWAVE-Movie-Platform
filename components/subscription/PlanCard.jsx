'use client';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
export default function PlanCard({
  plan,
  price,
  period,
  duration,
  badge,
  savings,
  benefits,
  highlighted,
  onSelect,
  loading,
}) {
  const featureList = benefits || [];

  return (
    <div
      className={cn(
        'relative rounded-xl border p-6 sm:p-8 transition-all duration-200 flex flex-col',
        highlighted
          ? 'border-cw-red bg-cw-bg-secondary scale-[1.02] shadow-lg shadow-cw-red/10'
          : 'border-cw-border bg-cw-bg-secondary hover:border-cw-text-secondary'
      )}
    >
      {badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge variant="red" className="text-xs px-3 py-1 whitespace-nowrap">
            {badge}
          </Badge>
        </div>
      )}

      <div className="text-center mb-6">
        <h3 className="text-fluid-3xl font-heading font-extrabold text-white mb-1">{price}</h3>
        <p className="text-sm text-cw-text-muted mb-1">{period}</p>
        <p className="text-xs text-cw-text-secondary">{duration}</p>
        {savings && (
          <p className="text-xs text-green-400 font-semibold mt-2">{savings}</p>
        )}
      </div>

      {/* Benefits list */}
      <ul className="space-y-3 mb-6 flex-1">
        {featureList.map((benefit, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm text-cw-text-secondary">
            <Check size={16} className="text-green-400 shrink-0 mt-0.5" />
            <span>{benefit}</span>
          </li>
        ))}
      </ul>

      <Button
        onClick={onSelect}
        loading={loading}
        className="w-full"
        variant={highlighted ? 'primary' : 'outline'}
      >
        Subscribe Now
      </Button>
    </div>
  );
}
