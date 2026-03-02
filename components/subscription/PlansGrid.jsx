'use client';
import PlanCard from './PlanCard';

export default function PlansGrid({ onSelectPlan, loading }) {
  return (
    <div>
      {/* Free trial banner */}
      <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 border border-green-700/40 rounded-xl p-5 sm:p-6 mb-8 text-center">
        <h3 className="text-lg sm:text-xl font-bold text-green-400 mb-2">
          🎉 First 2 Months Completely Free!
        </h3>
        <p className="text-sm text-cw-text-secondary max-w-md mx-auto">
          Get 2 months free trial after registration. No payment required. Choose your plan after the trial ends.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <PlanCard
          plan="monthly"
          price="৳20"
          period="Per Month"
          duration="For 1 Month"
          benefits={[
            'Unlimited Movies & Series',
            'HD Quality Streaming',
            'Watch on 1 Device',
            'Cancel Anytime',
            'New Releases Every Week',
          ]}
          onSelect={() => onSelectPlan?.('monthly')}
          loading={loading}
        />
        <PlanCard
          plan="sixMonth"
          price="৳100"
          period="For 6 Months"
          duration="৳16.67/month"
          badge="MOST POPULAR"
          savings="Save ৳20"
          benefits={[
            'Unlimited Movies & Series',
            'Full HD Quality Streaming',
            'Watch on 2 Devices',
            'Download for Offline',
            'New Releases Every Week',
            'Priority Customer Support',
          ]}
          highlighted
          onSelect={() => onSelectPlan?.('sixMonth')}
          loading={loading}
        />
        <PlanCard
          plan="yearly"
          price="৳200"
          period="For 1 Year"
          duration="৳16.67/month"
          badge="BEST VALUE"
          savings="Save ৳40"
          benefits={[
            'Unlimited Movies & Series',
            '4K Ultra HD Streaming',
            'Watch on 4 Devices',
            'Download for Offline',
            'New Releases Every Week',
            'Priority Customer Support',
            'Exclusive Early Access',
            'Ad-Free Experience',
          ]}
          onSelect={() => onSelectPlan?.('yearly')}
          loading={loading}
        />
      </div>
    </div>
  );
}
