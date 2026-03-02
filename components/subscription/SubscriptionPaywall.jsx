'use client';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import PlanCard from './PlanCard';

export default function SubscriptionPaywall({ onSelectPlan, loading }) {
  const features = [
    'Unlimited content',
    'HD 1080p',
    'All devices',
    'No ads',
    '5 profiles',
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 bg-cw-bg/95 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
    >
      <div className="max-w-4xl w-full py-8">
        <div className="text-center mb-8">
          <h1 className="text-cw-red font-heading font-extrabold text-2xl mb-4">CINEWAVE</h1>
          <h2 className="text-fluid-2xl md:text-fluid-3xl font-heading font-bold text-white mb-2">
            Your Free Trial Has Ended
          </h2>
          <p className="text-cw-text-muted text-sm md:text-base">
            Choose a plan to continue enjoying CineWave
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
          <PlanCard
            plan="monthly"
            price="৳20"
            period="per month"
            duration="1 month"
            onSelect={() => onSelectPlan('monthly')}
            loading={loading}
          />
          <PlanCard
            plan="sixMonth"
            price="৳100"
            period="for 6 months"
            duration="6 months"
            badge="MOST POPULAR"
            savings="Save ৳20"
            highlighted
            onSelect={() => onSelectPlan('sixMonth')}
            loading={loading}
          />
          <PlanCard
            plan="yearly"
            price="৳200"
            period="for 1 year"
            duration="1 year"
            badge="BEST VALUE"
            savings="Save ৳40"
            onSelect={() => onSelectPlan('yearly')}
            loading={loading}
          />
        </div>

        <div className="text-center">
          <div className="flex flex-wrap items-center justify-center gap-4 mb-4">
            {features.map((f) => (
              <span key={f} className="flex items-center gap-1.5 text-sm text-cw-text-muted">
                <Check size={16} className="text-green-500" /> {f}
              </span>
            ))}
          </div>
          <p className="text-xs text-cw-text-secondary">Cancel anytime</p>
        </div>
      </div>
    </motion.div>
  );
}
