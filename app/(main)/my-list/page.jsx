'use client';
import { useAuthStore } from '@/store/authStore';
import WatchlistGrid from '@/components/profile/WatchlistGrid';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function MyListPage() {
  const router = useRouter();
  const { activeProfile } = useAuthStore();

  useEffect(() => {
    if (!activeProfile) {
      router.push('/profiles');
    }
  }, [activeProfile, router]);

  if (!activeProfile) return null;

  return (
    <div className="pt-20 sm:pt-24 px-4 sm:px-6 md:px-10 lg:px-16 pb-8 min-h-screen">
      <h1 className="text-2xl sm:text-3xl font-bold mb-2">My List</h1>
      <p className="text-cw-text-secondary mb-8">Movies and shows you saved</p>
      <WatchlistGrid profileId={activeProfile._id} />
    </div>
  );
}
