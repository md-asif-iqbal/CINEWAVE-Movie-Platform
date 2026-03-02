'use client';
import { useState, useEffect } from 'react';
import ContentCard from '@/components/content/ContentCard';
import Spinner from '@/components/ui/Spinner';
import axios from 'axios';

export default function WatchlistGrid({ items, profileId }) {
  const [watchlist, setWatchlist] = useState(items || []);
  const [loading, setLoading] = useState(!items && !!profileId);

  useEffect(() => {
    if (!items && profileId) {
      fetchWatchlist();
    }
  }, [profileId]);

  const fetchWatchlist = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/profile/${profileId}`);
      const profile = data.profile;
      setWatchlist(profile?.watchlist || []);
    } catch (err) {
      console.error('Fetch watchlist error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-12"><Spinner size="lg" /></div>;
  }

  if (!watchlist.length) {
    return (
      <div className="text-center py-12">
        <p className="text-cw-text-secondary">Your watchlist is empty</p>
        <p className="text-sm text-cw-text-secondary mt-1">Browse and add movies or shows to your list</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 md:gap-3">
      {watchlist.map((item) => (
        <ContentCard key={item._id} content={item} />
      ))}
    </div>
  );
}
