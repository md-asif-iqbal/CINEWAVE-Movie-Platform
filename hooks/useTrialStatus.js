'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export default function useTrialStatus() {
  const { data: session } = useSession();
  const [trialStatus, setTrialStatus] = useState({
    isActive: false,
    daysRemaining: 0,
    isExpiringSoon: false,
    endDate: null,
  });

  useEffect(() => {
    if (session?.user?.trialEndDate) {
      const now = new Date();
      const trialEnd = new Date(session.user.trialEndDate);
      const diff = trialEnd - now;
      const daysRemaining = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));

      setTrialStatus({
        isActive: now < trialEnd,
        daysRemaining,
        isExpiringSoon: daysRemaining <= 7 && daysRemaining > 0,
        endDate: trialEnd,
      });
    }
  }, [session]);

  return trialStatus;
}
