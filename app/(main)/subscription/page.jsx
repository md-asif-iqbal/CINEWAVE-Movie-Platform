'use client';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import PlansGrid from '@/components/subscription/PlansGrid';
import PaymentStatusCard from '@/components/subscription/PaymentStatusCard';
import useSubscription from '@/hooks/useSubscription';
import Spinner from '@/components/ui/Spinner';

function SubscriptionContent() {
  const searchParams = useSearchParams();
  const paymentStatus = searchParams.get('status');
  const { status, loading } = useSubscription();

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (paymentStatus) {
    return (
      <div className="max-w-md mx-auto">
        <PaymentStatusCard status={paymentStatus} />
      </div>
    );
  }

  return (
    <div>
      {status?.hasAccess ? (
        <div className="max-w-2xl mx-auto">
          <div className="bg-cw-bg-card border border-cw-border rounded-xl p-6 sm:p-8 text-center">
            <h2 className="text-xl font-bold mb-2">
              Your Subscription is Active
            </h2>
            <p className="text-cw-text-secondary text-sm">
              {status.trial?.isActive
                ? `Free Trial: ${status.trial.daysRemaining} days remaining`
                : status.subscription
                ? `${status.subscription.plan} plan active`
                : 'Active'}
            </p>
          </div>
        </div>
      ) : (
        <PlansGrid />
      )}
    </div>
  );
}

export default function SubscriptionPage() {
  return (
    <div className="pt-20 sm:pt-24 px-4 sm:px-6 md:px-10 lg:px-16 pb-8 min-h-screen">
      <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-center">
        Subscription Plans
      </h1>
      <p className="text-cw-text-secondary text-center mb-8 sm:mb-12 max-w-lg mx-auto">
        Choose your preferred plan and enjoy unlimited streaming content
      </p>
      <Suspense fallback={<div className="flex justify-center py-20"><Spinner size="lg" /></div>}>
        <SubscriptionContent />
      </Suspense>
    </div>
  );
}
