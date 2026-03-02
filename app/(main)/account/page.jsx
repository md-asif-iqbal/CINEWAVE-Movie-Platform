'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useAuthStore } from '@/store/authStore';
import WatchHistory from '@/components/profile/WatchHistory';
import WatchlistGrid from '@/components/profile/WatchlistGrid';
import SettingsForm from '@/components/profile/SettingsForm';
import SubscriptionInfo from '@/components/profile/SubscriptionInfo';
import useSubscription from '@/hooks/useSubscription';
import axios from 'axios';

export default function MyAccountPage() {
  const { data: session } = useSession();
  const { activeProfile } = useAuthStore();
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState('watchlist');
  const { status, loading: subLoading } = useSubscription();

  useEffect(() => {
    if (activeProfile) {
      fetchProfile();
    }
  }, [activeProfile]);

  const fetchProfile = async () => {
    try {
      const { data } = await axios.get(`/api/profile/${activeProfile._id}`);
      setProfile(data.profile);
    } catch (err) {
      console.error(err);
    }
  };

  const tabs = [
    { id: 'watchlist', label: 'Watchlist' },
    { id: 'history', label: 'History' },
    { id: 'subscription', label: 'Subscription' },
    { id: 'settings', label: 'Settings' },
  ];

  return (
    <div className="pt-20 sm:pt-24 px-4 sm:px-6 md:px-10 lg:px-16 pb-8 min-h-screen">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">My Account</h1>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto scrollbar-hide mb-6 sm:mb-8 border-b border-cw-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors min-h-[44px] border-b-2 ${
              activeTab === tab.id
                ? 'text-white border-cw-red'
                : 'text-cw-text-muted border-transparent hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'watchlist' && (
        <WatchlistGrid profileId={activeProfile?._id} />
      )}

      {activeTab === 'history' && (
        <WatchHistory profileId={activeProfile?._id} />
      )}

      {activeTab === 'subscription' && (
        <SubscriptionInfo status={status} loading={subLoading} />
      )}

      {activeTab === 'settings' && profile && (
        <SettingsForm profile={profile} onUpdate={fetchProfile} />
      )}
    </div>
  );
}
