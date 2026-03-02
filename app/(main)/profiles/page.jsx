'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import ProfileSelector from '@/components/profile/ProfileSelector';
import ProfileCardSkeleton from '@/components/skeletons/ProfileCardSkeleton';
import axios from 'axios';

export default function ProfilesPage() {
  const { data: session } = useSession();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) {
      fetchProfiles();
    }
  }, [session]);

  const fetchProfiles = async () => {
    try {
      const { data } = await axios.get('/api/profile');
      setProfiles(data.profiles);
    } catch (err) {
      console.error('Failed to fetch profiles:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 sm:mb-12">Who's Watching?</h1>
        {loading ? (
          <ProfileCardSkeleton />
        ) : (
          <ProfileSelector profiles={profiles} onRefresh={fetchProfiles} />
        )}
      </div>
    </div>
  );
}
