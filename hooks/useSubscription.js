'use client';
import { useEffect } from 'react';
import useSubscriptionStore from '@/store/subscriptionStore';

export default function useSubscription() {
  const { status, loading, error, fetchStatus, initiatePayment, paymentLoading } =
    useSubscriptionStore();

  useEffect(() => {
    fetchStatus();
  }, []);

  return {
    status,
    loading,
    error,
    refetch: fetchStatus,
    initiatePayment,
    paymentLoading,
    hasAccess: status?.hasAccess ?? false,
    needsSubscription: status?.needsSubscription ?? false,
    trialActive: status?.trialActive ?? false,
    trialDaysRemaining: status?.trialDaysRemaining ?? 0,
    isExpiringSoon: status?.isExpiringSoon ?? false,
  };
}
