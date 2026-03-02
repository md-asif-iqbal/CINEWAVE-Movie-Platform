'use client';
import { useState, useCallback } from 'react';
import axios from 'axios';
import useAuthStore from '@/store/authStore';

export default function useWatchlist() {
  const [loading, setLoading] = useState(false);
  const activeProfile = useAuthStore((s) => s.activeProfile);

  const addToWatchlist = useCallback(
    async (contentId) => {
      if (!activeProfile?._id) return;
      setLoading(true);
      try {
        await axios.post('/api/profile/watchlist', {
          profileId: activeProfile._id,
          contentId,
        });
      } catch (err) {
        console.error('Add to watchlist error:', err);
      } finally {
        setLoading(false);
      }
    },
    [activeProfile]
  );

  const removeFromWatchlist = useCallback(
    async (contentId) => {
      if (!activeProfile?._id) return;
      setLoading(true);
      try {
        await axios.delete('/api/profile/watchlist', {
          data: { profileId: activeProfile._id, contentId },
        });
      } catch (err) {
        console.error('Remove from watchlist error:', err);
      } finally {
        setLoading(false);
      }
    },
    [activeProfile]
  );

  const isInWatchlist = useCallback(
    (contentId) => {
      if (!activeProfile?.watchlist) return false;
      return activeProfile.watchlist.some(
        (id) => id.toString() === contentId.toString()
      );
    },
    [activeProfile]
  );

  return { addToWatchlist, removeFromWatchlist, isInWatchlist, loading };
}
