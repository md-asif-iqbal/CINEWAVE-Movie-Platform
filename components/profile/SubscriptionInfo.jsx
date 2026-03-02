'use client';
import Badge from '@/components/ui/Badge';
import ProgressBar from '@/components/ui/ProgressBar';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';

export default function SubscriptionInfo({ status: subscriptionStatus, loading }) {
  if (loading) {
    return <div className="text-center py-8 text-cw-text-muted">Loading subscription info...</div>;
  }
  if (!subscriptionStatus) return null;

  const {
    trialActive,
    trialDaysRemaining,
    trialEndDate,
    hasActiveSubscription,
    subscription,
    needsSubscription,
  } = subscriptionStatus;

  return (
    <div className="space-y-4">
      {/* Current Status */}
      <div className="bg-cw-bg-secondary border border-cw-border rounded-lg p-4 md:p-6">
        <h3 className="text-lg font-heading font-semibold text-white mb-3">Subscription Status</h3>

        {trialActive && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="green">Free Trial Active</Badge>
              <span className="text-sm text-cw-text-muted">{trialDaysRemaining} days remaining</span>
            </div>
            <p className="text-xs text-cw-text-secondary mb-3">
              Ends: {formatDate(trialEndDate)}
            </p>
            <ProgressBar value={60 - trialDaysRemaining} max={60} color="green" className="mb-4" />
            <Link href="/subscribe">
              <Button variant="outline" size="sm">
                Subscribe Now
              </Button>
            </Link>
          </div>
        )}

        {hasActiveSubscription && subscription && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="green">Active</Badge>
              <Badge variant="outline">{subscription.plan}</Badge>
            </div>
            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between">
                <span className="text-cw-text-secondary">Start Date</span>
                <span className="text-white">{formatDate(subscription.startDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-cw-text-secondary">End Date</span>
                <span className="text-white">{formatDate(subscription.endDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-cw-text-secondary">Days Remaining</span>
                <span className="text-white">{subscription.daysRemaining}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-cw-text-secondary">Amount Paid</span>
                <span className="text-white">৳{subscription.amount}</span>
              </div>
            </div>
            <ProgressBar
              value={subscription.daysRemaining}
              max={subscription.plan === 'monthly' ? 30 : subscription.plan === 'sixMonth' ? 180 : 365}
              color="green"
              className="mb-4"
            />
            <Link href="/subscribe">
              <Button variant="outline" size="sm">
                Change Plan
              </Button>
            </Link>
          </div>
        )}

        {needsSubscription && !trialActive && (
          <div>
            <p className="text-cw-text-muted mb-3">
              Your subscription has ended — choose a plan
            </p>
            <Link href="/subscribe">
              <Button>Subscribe</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
