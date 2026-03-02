'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Play } from 'lucide-react';
import ProgressBar from '@/components/ui/ProgressBar';
import Spinner from '@/components/ui/Spinner';
import { formatDate, calculateProgress } from '@/lib/utils';
import axios from 'axios';

export default function WatchHistory({ history: initialHistory, profileId }) {
  const [history, setHistory] = useState(initialHistory || []);
  const [loading, setLoading] = useState(!initialHistory && !!profileId);

  useEffect(() => {
    if (!initialHistory && profileId) {
      fetchHistory();
    }
  }, [profileId]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/profile/${profileId}/history`);
      setHistory(data.history || []);
    } catch (err) {
      console.error('Fetch history error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-12"><Spinner size="lg" /></div>;
  }

  if (!history.length) {
    return (
      <div className="text-center py-12">
        <p className="text-cw-text-secondary">No watch history yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {history.map((item, idx) => (
        <Link
          key={idx}
          href={`/watch/${item.content?._id || item.content}`}
          className="flex gap-3 md:gap-4 p-3 rounded-lg hover:bg-cw-bg-card transition-colors"
        >
          <div className="relative w-28 md:w-40 aspect-video rounded overflow-hidden bg-cw-bg-card shrink-0">
            {item.content?.thumbnailUrl ? (
              <Image
                src={item.content.thumbnailUrl}
                alt={item.content.title || ''}
                fill
                className="object-cover"
                sizes="160px"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Play size={20} className="text-cw-text-secondary" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-white truncate mb-1">
              {item.content?.title || 'Unknown'}
            </h3>
            <p className="text-xs text-cw-text-secondary mb-2">
              Watched {formatDate(item.watchedAt)}
            </p>
            {item.duration > 0 && (
              <ProgressBar value={item.progress || 0} max={item.duration} />
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}
