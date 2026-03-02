export function hasWatchAccess(user, activeSubscription) {
  if (!user) return false;
  if (user.isBanned) return false;
  const trialActive = new Date() < new Date(user.trialEndDate);
  if (trialActive) return true;
  if (
    activeSubscription &&
    activeSubscription.status === 'active' &&
    new Date() < new Date(activeSubscription.endDate)
  )
    return true;
  return false;
}

export function getTrialStatus(user) {
  const now = new Date();
  const trialEnd = new Date(user.trialEndDate);
  const daysRemaining = Math.ceil((trialEnd - now) / (1000 * 60 * 60 * 24));
  return {
    isActive: now < trialEnd,
    daysRemaining: Math.max(0, daysRemaining),
    endDate: trialEnd,
    isExpiringSoon: daysRemaining <= 7 && daysRemaining > 0,
  };
}

export function getPlanDetails(plan) {
  const plans = {
    monthly: {
      name: 'Monthly',
      duration: 30,
      amount: 20,
      savings: null,
      label: '৳20/month',
      badge: null,
      benefits: [
        'Unlimited Movies & Series',
        'HD Quality Streaming',
        'Watch on 1 Device',
        'Cancel Anytime',
        'New Releases Every Week',
      ],
    },
    sixMonth: {
      name: '6 Months',
      duration: 180,
      amount: 100,
      savings: 'Save ৳20',
      label: '৳100 for 6 months',
      badge: 'MOST POPULAR',
      benefits: [
        'Unlimited Movies & Series',
        'Full HD Quality Streaming',
        'Watch on 2 Devices',
        'Download for Offline',
        'New Releases Every Week',
        'Priority Customer Support',
      ],
    },
    yearly: {
      name: 'Yearly',
      duration: 365,
      amount: 200,
      savings: 'Save ৳40',
      label: '৳200/year',
      badge: 'BEST VALUE',
      benefits: [
        'Unlimited Movies & Series',
        '4K Ultra HD Streaming',
        'Watch on 4 Devices',
        'Download for Offline',
        'New Releases Every Week',
        'Priority Customer Support',
        'Exclusive Early Access',
        'Ad-Free Experience',
      ],
    },
  };
  return plans[plan];
}

export function calculateEndDate(plan, startDate = new Date()) {
  const durations = { monthly: 30, sixMonth: 180, yearly: 365 };
  const end = new Date(startDate);
  end.setDate(end.getDate() + durations[plan]);
  return end;
}

export function getSubscriptionStatus(user, subscription) {
  const trial = getTrialStatus(user);
  const hasActiveSub =
    subscription &&
    subscription.status === 'active' &&
    new Date() < new Date(subscription.endDate);

  let subDaysRemaining = 0;
  if (hasActiveSub) {
    subDaysRemaining = Math.max(
      0,
      Math.ceil((new Date(subscription.endDate) - new Date()) / (1000 * 60 * 60 * 24))
    );
  }

  return {
    hasTrial: true,
    trialActive: trial.isActive,
    trialDaysRemaining: trial.daysRemaining,
    trialEndDate: trial.endDate,
    hasActiveSubscription: !!hasActiveSub,
    subscription: hasActiveSub
      ? {
          plan: subscription.plan,
          endDate: subscription.endDate,
          daysRemaining: subDaysRemaining,
          startDate: subscription.startDate,
          amount: subscription.amount,
        }
      : null,
    hasAccess: trial.isActive || !!hasActiveSub,
    needsSubscription: !trial.isActive && !hasActiveSub,
    isExpiringSoon: trial.isExpiringSoon || (hasActiveSub && subDaysRemaining <= 3),
  };
}

export function getAllPlans() {
  return [
    getPlanDetails('monthly'),
    getPlanDetails('sixMonth'),
    getPlanDetails('yearly'),
  ].map((plan, i) => ({
    ...plan,
    id: ['monthly', 'sixMonth', 'yearly'][i],
  }));
}
